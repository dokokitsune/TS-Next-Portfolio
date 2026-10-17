"use client";

import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCodeBranch } from "@fortawesome/free-solid-svg-icons";
import styles from "../layout.module.css";

type NvimMode = "NORMAL" | "INSERT" | "VISUAL" | "VISUAL LINE" | "COMMAND";
type PromptKind = ":" | "/";

const modeDataAttr: Record<NvimMode, string> = {
  NORMAL: "normal",
  INSERT: "insert",
  VISUAL: "visual",
  "VISUAL LINE": "visual",
  COMMAND: "command",
};

const sectionBuffers: { id: string; file: string; lineBase: number }[] = [
  { id: "home", file: "~/portfolio/home.yaml", lineBase: 1 },
  { id: "about", file: "~/portfolio/about.yaml", lineBase: 48 },
  { id: "projects", file: "~/portfolio/projects.yaml", lineBase: 142 },
  { id: "contact", file: "~/portfolio/contact.yaml", lineBase: 260 },
];

interface CommandItem {
  cmd: string;
  aliases?: string[];
  description: string;
}

const nvimCommands: CommandItem[] = [
  { cmd: "q", aliases: ["q!", "qa", "qa!", "quit"], description: "Close tab / quit Neovim" },
  { cmd: "w", aliases: ["write"], description: "Write buffer to disk" },
  { cmd: "wq", aliases: ["wq!", "x"], description: "Write buffer and quit" },
  { cmd: "wqa", aliases: ["wqa!", "xa", "xa!"], description: "Write all buffers and quit" },
  { cmd: "noh", aliases: ["nohlsearch"], description: "Clear / search highlights" },
  { cmd: "help", aliases: ["h"], description: "Toggle keymap and command guide" },
  { cmd: "e home", aliases: ["home"], description: "Open ~/portfolio/home.yaml" },
  { cmd: "e about", aliases: ["about"], description: "Open ~/portfolio/about.yaml" },
  { cmd: "e projects", aliases: ["projects"], description: "Open ~/portfolio/projects.yaml" },
  { cmd: "e contact", aliases: ["contact"], description: "Open ~/portfolio/contact.yaml" },
  { cmd: "resume", aliases: ["cv"], description: "Open PDF résumé in new tab" },
  { cmd: "github", aliases: ["gh"], description: "Open GitHub profile" },
  { cmd: "linkedin", aliases: ["li"], description: "Open LinkedIn profile" },
  { cmd: "whoami", description: "Print user identity in statusline" },
];

function isEditableElement(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || target.isContentEditable;
}

function findTextRanges(query: string): Range[] {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return [];
  const root = document.getElementById("main-content");
  if (!root) return [];

  const ranges: Range[] = [];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement;
      if (!parent) return NodeFilter.FILTER_REJECT;
      if (parent.closest(".visually-hidden, [aria-hidden='true'], script, style")) {
        return NodeFilter.FILTER_REJECT;
      }
      if (parent.offsetParent === null) {
        return NodeFilter.FILTER_REJECT;
      }
      return NodeFilter.FILTER_ACCEPT;
    },
  });

  let current = walker.nextNode();
  while (current) {
    const text = current.textContent ?? "";
    const lower = text.toLowerCase();
    let startIndex = 0;
    while (startIndex < lower.length) {
      const found = lower.indexOf(trimmed, startIndex);
      if (found === -1) break;
      const range = document.createRange();
      range.setStart(current, found);
      range.setEnd(current, found + trimmed.length);
      ranges.push(range);
      startIndex = found + trimmed.length;
    }
    current = walker.nextNode();
  }

  return ranges;
}

function applyBrowserHighlights(ranges: Range[], activeIdx: number) {
  const cssWithHighlights = CSS as unknown as {
    highlights?: {
      set: (name: string, highlight: unknown) => void;
      delete: (name: string) => void;
    };
  };
  const HighlightCtor = (window as unknown as { Highlight?: new (...r: Range[]) => unknown }).Highlight;
  if (!cssWithHighlights.highlights || !HighlightCtor) return;

  if (!ranges.length) {
    cssWithHighlights.highlights.delete("nvim-search");
    cssWithHighlights.highlights.delete("nvim-search-current");
    return;
  }

  const otherRanges = ranges.filter((_, i) => i !== activeIdx);
  cssWithHighlights.highlights.set("nvim-search", new HighlightCtor(...otherRanges));
  const currentRange = ranges[activeIdx];
  if (currentRange) {
    cssWithHighlights.highlights.set("nvim-search-current", new HighlightCtor(currentRange));
  } else {
    cssWithHighlights.highlights.delete("nvim-search-current");
  }
}

function scrollToRange(range: Range | undefined) {
  const el = range?.startContainer.parentElement;
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}

export default function NvimStatusBar() {
  const [mode, setMode] = useState<NvimMode>("NORMAL");
  const [keyBuffer, setKeyBuffer] = useState("");
  const [statusMsg, setStatusMsg] = useState<{ text: string; isError?: boolean } | null>(null);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [promptKind, setPromptKind] = useState<PromptKind>(":");
  const [cmdInput, setCmdInput] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [helpOpen, setHelpOpen] = useState(false);
  const [exited, setExited] = useState(false);
  const [bufferFile, setBufferFile] = useState("~/portfolio/home.yaml");
  const [scrollLabel, setScrollLabel] = useState("TOP");
  const [cursorPos, setCursorPos] = useState("1:1");
  const cmdInputRef = useRef<HTMLInputElement>(null);
  const statusTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchStateRef = useRef<{ query: string; ranges: Range[]; index: number }>({
    query: "",
    ranges: [],
    index: 0,
  });

  const normalizedQuery = cmdInput.trim().replace(/^:+/, "").toLowerCase();
  const filteredCommands =
    promptKind === ":"
      ? nvimCommands.filter((item) => {
          if (!normalizedQuery) return true;
          return (
            item.cmd.toLowerCase().includes(normalizedQuery) ||
            item.description.toLowerCase().includes(normalizedQuery) ||
            item.aliases?.some((alias) => alias.toLowerCase().includes(normalizedQuery))
          );
        })
      : [];

  function showStatusMessage(text: string, isError = false) {
    setStatusMsg({ text, isError });
    if (statusTimerRef.current) clearTimeout(statusTimerRef.current);
    statusTimerRef.current = setTimeout(() => {
      setStatusMsg(null);
    }, 4000);
  }

  function clearPageSearch() {
    searchStateRef.current = { query: "", ranges: [], index: 0 };
    applyBrowserHighlights([], 0);
  }

  function runPageSearch(query: string, finalize = false) {
    const trimmed = query.trim();
    if (!trimmed) {
      clearPageSearch();
      return;
    }

    const ranges = findTextRanges(trimmed);
    searchStateRef.current = { query: trimmed, ranges, index: 0 };

    if (!ranges.length) {
      applyBrowserHighlights([], 0);
      if (finalize) {
        showStatusMessage(`E486: Pattern not found: ${trimmed}`, true);
      }
      return;
    }

    applyBrowserHighlights(ranges, 0);
    scrollToRange(ranges[0]);
    if (finalize) {
      showStatusMessage(`/${trimmed} [1/${ranges.length}]`);
    }
  }

  function stepSearchMatch(delta: 1 | -1) {
    const state = searchStateRef.current;
    if (!state.query) return false;

    const ranges = findTextRanges(state.query);
    if (!ranges.length) {
      applyBrowserHighlights([], 0);
      showStatusMessage(`E486: Pattern not found: ${state.query}`, true);
      return true;
    }

    const nextIdx = (state.index + delta + ranges.length) % ranges.length;
    searchStateRef.current = { query: state.query, ranges, index: nextIdx };
    applyBrowserHighlights(ranges, nextIdx);
    scrollToRange(ranges[nextIdx]);
    showStatusMessage(`/${state.query} [${nextIdx + 1}/${ranges.length}]`);
    return true;
  }

  function closeCommandLine() {
    setCmdOpen(false);
    setCmdInput("");
    setSelectedIndex(0);
    setMode("NORMAL");
  }

  function scrollToSection(sectionId: string, fileLabel: string) {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      showStatusMessage(`"${fileLabel}" 84L, 2410B`);
    }
  }

  function executeCommand(rawInput: string) {
    const cleaned = rawInput.trim().replace(/^:+/, "").toLowerCase();
    closeCommandLine();

    if (!cleaned) return;

    if (["q", "q!", "qa", "qa!", "quit", "wq", "wq!", "wqa", "wqa!", "x", "xa", "xa!"].includes(cleaned)) {
      setExited(true);
      try {
        window.open("", "_self");
        window.close();
      } catch {
        // Browser blocked closing a non script opened tab; fallback to terminal exit overlay
      }
      return;
    }

    if (cleaned === "w" || cleaned === "wa" || cleaned === "write") {
      showStatusMessage(`"${bufferFile}" 320L, 8420B written`);
      return;
    }

    if (cleaned === "noh" || cleaned === "nohlsearch") {
      clearPageSearch();
      showStatusMessage("Search highlights cleared");
      return;
    }

    if (cleaned === "help" || cleaned === "h") {
      setHelpOpen((prev) => !prev);
      showStatusMessage(":help portfolio.txt");
      return;
    }

    if (cleaned === "e home" || cleaned === "home" || cleaned === "1") {
      scrollToSection("home", "~/portfolio/home.yaml");
      return;
    }

    if (cleaned === "e about" || cleaned === "about") {
      scrollToSection("about", "~/portfolio/about.yaml");
      return;
    }

    if (cleaned === "e projects" || cleaned === "projects") {
      scrollToSection("projects", "~/portfolio/projects.yaml");
      return;
    }

    if (cleaned === "e contact" || cleaned === "contact") {
      scrollToSection("contact", "~/portfolio/contact.yaml");
      return;
    }

    if (cleaned === "resume" || cleaned === "cv") {
      window.open("https://wwood-next-portfolio.s3.us-west-2.amazonaws.com/Resumes/Tech+Resume.pdf", "_blank", "noopener,noreferrer");
      showStatusMessage("Opened Tech Resume.pdf");
      return;
    }

    if (cleaned === "github" || cleaned === "gh") {
      window.open("https://github.com/dokokitsune", "_blank", "noopener,noreferrer");
      showStatusMessage("Opened github.com/dokokitsune");
      return;
    }

    if (cleaned === "linkedin" || cleaned === "li") {
      window.open("https://www.linkedin.com/in/weston-wood9802/", "_blank", "noopener,noreferrer");
      showStatusMessage("Opened linkedin.com/in/weston-wood9802");
      return;
    }

    if (cleaned === "whoami") {
      showStatusMessage("weston.wood · DevOps Engineer @ Apollo Global Management");
      return;
    }

    showStatusMessage(`E492: Not an editor command: ${rawInput.trim()}`, true);
  }

  useEffect(() => {
    if (cmdOpen) {
      requestAnimationFrame(() => {
        cmdInputRef.current?.focus();
      });
    }
  }, [cmdOpen]);

  useEffect(() => {
    let frame = 0;

    function updateStatus() {
      frame = 0;
      const scrollTop = window.scrollY;
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const ratio = Math.min(1, Math.max(0, scrollTop / maxScroll));

      if (scrollTop <= 4) {
        setScrollLabel("TOP");
      } else if (ratio >= 0.99) {
        setScrollLabel("BOT");
      } else {
        setScrollLabel(`${Math.round(ratio * 100)}%`);
      }

      const line = Math.max(1, Math.round(1 + ratio * 319));
      setCursorPos(`${line}:1`);

      const offset = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 112;
      let activeFile = sectionBuffers[0].file;
      for (const item of sectionBuffers) {
        const el = document.getElementById(item.id);
        if (el && el.getBoundingClientRect().top <= offset + 1) {
          activeFile = item.file;
        }
      }
      if (scrollTop > 0 && window.innerHeight + scrollTop >= document.documentElement.scrollHeight - 2) {
        activeFile = sectionBuffers[sectionBuffers.length - 1].file;
      }
      setBufferFile(activeFile);
    }

    function scheduleUpdate() {
      if (!frame) frame = requestAnimationFrame(updateStatus);
    }

    scheduleUpdate();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, []);

  useEffect(() => {
    let pendingG = false;
    let keyTimer: ReturnType<typeof setTimeout> | null = null;

    function showKey(label: string) {
      setKeyBuffer(label);
      if (keyTimer) clearTimeout(keyTimer);
      keyTimer = setTimeout(() => {
        setKeyBuffer("");
      }, 1800);
    }

    function handleFocusIn(event: FocusEvent) {
      if (event.target === cmdInputRef.current) return;
      if (isEditableElement(event.target)) {
        setMode("INSERT");
      }
    }

    function handleFocusOut(event: FocusEvent) {
      if (event.target === cmdInputRef.current) return;
      if (isEditableElement(event.target)) {
        setMode("NORMAL");
      }
    }

    function handleSelectionChange() {
      if (cmdOpen || isEditableElement(document.activeElement)) return;
      const selection = window.getSelection();
      if (selection && selection.toString().trim().length > 0) {
        setMode("VISUAL");
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (exited) {
        if (event.key === "Enter" || event.key === "Escape" || event.key === " ") {
          event.preventDefault();
          setExited(false);
          setMode("NORMAL");
        }
        return;
      }

      if (cmdOpen) return;

      if (event.metaKey || event.ctrlKey || event.altKey) {
        if (event.ctrlKey && event.key === "[") {
          setHelpOpen(false);
          clearPageSearch();
          setMode("NORMAL");
          showKey("<C-[>");
          if (isEditableElement(document.activeElement) && document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
          }
        }
        return;
      }

      if (event.key === "Escape") {
        pendingG = false;
        setHelpOpen(false);
        clearPageSearch();
        setMode("NORMAL");
        showKey("<Esc>");
        window.getSelection()?.removeAllRanges();
        if (isEditableElement(document.activeElement) && document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
        return;
      }

      if (isEditableElement(event.target)) {
        return;
      }

      const key = event.key;

      if (pendingG) {
        pendingG = false;
        if (key === "g") {
          showKey("gg");
          window.scrollTo({ top: 0, behavior: "smooth" });
          return;
        }
      }

      if (key === "g") {
        pendingG = true;
        showKey("g");
        return;
      }

      if (key === "G") {
        showKey("G");
        window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" });
        return;
      }

      if (key === "j") {
        showKey("j");
        window.scrollBy({ top: 140, behavior: "smooth" });
        return;
      }

      if (key === "k") {
        showKey("k");
        window.scrollBy({ top: -140, behavior: "smooth" });
        return;
      }

      if (key === "n") {
        showKey("n");
        stepSearchMatch(1);
        return;
      }

      if (key === "N") {
        showKey("N");
        stepSearchMatch(-1);
        return;
      }

      if (key === "i" || key === "a") {
        setMode("INSERT");
        showKey(key);
        return;
      }

      if (key === "v") {
        setMode((current) => (current === "VISUAL" ? "NORMAL" : "VISUAL"));
        showKey("v");
        return;
      }

      if (key === "V") {
        setMode((current) => (current === "VISUAL LINE" ? "NORMAL" : "VISUAL LINE"));
        showKey("V");
        return;
      }

      if (key === ":") {
        event.preventDefault();
        setStatusMsg(null);
        setPromptKind(":");
        setMode("COMMAND");
        setCmdInput("");
        setSelectedIndex(0);
        setCmdOpen(true);
        showKey(":");
        return;
      }

      if (key === "/") {
        event.preventDefault();
        setStatusMsg(null);
        setPromptKind("/");
        setMode("COMMAND");
        setCmdInput("");
        setSelectedIndex(0);
        setCmdOpen(true);
        showKey("/");
        return;
      }

      if (key.length === 1) {
        showKey(key);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("focusin", handleFocusIn);
    window.addEventListener("focusout", handleFocusOut);
    document.addEventListener("selectionchange", handleSelectionChange);

    return () => {
      if (keyTimer) clearTimeout(keyTimer);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("focusin", handleFocusIn);
      window.removeEventListener("focusout", handleFocusOut);
      document.removeEventListener("selectionchange", handleSelectionChange);
    };
  }, [cmdOpen, exited]);

  function handleCmdKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    event.stopPropagation();

    if (event.key === "Escape" || (event.ctrlKey && event.key === "[")) {
      event.preventDefault();
      if (promptKind === "/") {
        clearPageSearch();
      }
      closeCommandLine();
      return;
    }

    if (event.key === "Backspace" && cmdInput === "") {
      event.preventDefault();
      if (promptKind === "/") {
        clearPageSearch();
      }
      closeCommandLine();
      return;
    }

    if (promptKind === ":") {
      if (event.key === "ArrowDown" || (event.key === "Tab" && !event.shiftKey)) {
        event.preventDefault();
        if (!filteredCommands.length) return;
        const next = (selectedIndex + 1) % filteredCommands.length;
        setSelectedIndex(next);
        if (event.key === "Tab") {
          setCmdInput(filteredCommands[next].cmd);
        }
        return;
      }

      if (event.key === "ArrowUp" || (event.key === "Tab" && event.shiftKey)) {
        event.preventDefault();
        if (!filteredCommands.length) return;
        const prev = (selectedIndex - 1 + filteredCommands.length) % filteredCommands.length;
        setSelectedIndex(prev);
        if (event.key === "Tab") {
          setCmdInput(filteredCommands[prev].cmd);
        }
        return;
      }
    }

    if (event.key === "Enter") {
      event.preventDefault();
      if (promptKind === "/") {
        const query = cmdInput;
        closeCommandLine();
        runPageSearch(query, true);
        return;
      }
      const targetCmd = cmdInput.trim() || filteredCommands[selectedIndex]?.cmd || "";
      executeCommand(targetCmd);
    }
  }

  const modeAttr = modeDataAttr[mode];

  if (exited) {
    return (
      <div className={styles.nvimExitOverlay} role="dialog" aria-modal="true" aria-label="Terminal session closed">
        <div className={styles.nvimExitTerminal}>
          <p className={styles.nvimExitLine}>
            <span className={styles.nvimExitPrompt}>wwood@homelab:~/portfolio$</span> nvim home.yaml
          </p>
          <p className={styles.nvimExitMuted}>[Process exited 0]</p>
          <p className={styles.nvimExitNote}>
            Your browser blocked closing this tab directly, so the Neovim buffer was closed instead.
          </p>
          <button
            type="button"
            className={styles.nvimReopenBtn}
            onClick={() => {
              setExited(false);
              setMode("NORMAL");
            }}
          >
            Press Enter or click to reopen nvim
          </button>
        </div>
      </div>
    );
  }

  return (
    <footer className={styles.lualineFooter} data-mode={modeAttr} aria-label="Status bar">
      <style>{`
        ::highlight(nvim-search) {
          background-color: rgba(139, 224, 201, 0.32);
          color: #eff3f8;
        }
        ::highlight(nvim-search-current) {
          background-color: #fcd34d;
          color: #0d1219;
        }
      `}</style>
      {helpOpen && (
        <div className={styles.nvimHelpPopup} role="dialog" aria-label="Neovim keymap and command help">
          <div className={styles.nvimHelpHeader}>
            <span>:help portfolio.txt</span>
            <button type="button" className={styles.nvimHelpClose} onClick={() => setHelpOpen(false)}>
              [x]
            </button>
          </div>
          <div className={styles.nvimHelpBody}>
            <p className={styles.nvimHelpSection}>NORMAL MODE KEYMAPS</p>
            <dl className={styles.nvimHelpList}>
              <div><dt>j / k</dt><dd>Scroll down / up</dd></div>
              <div><dt>gg / G</dt><dd>Jump to top / bottom</dd></div>
              <div><dt>/text</dt><dd>Search and highlight text on page</dd></div>
              <div><dt>n / N</dt><dd>Next / previous search match</dd></div>
              <div><dt>i / v / V</dt><dd>Switch to INSERT / VISUAL mode</dd></div>
              <div><dt>:</dt><dd>Open Neovim command menu</dd></div>
              <div><dt>Esc</dt><dd>Clear search and return to NORMAL</dd></div>
            </dl>
            <p className={styles.nvimHelpSection}>EX COMMANDS</p>
            <dl className={styles.nvimHelpList}>
              <div><dt>:q / :wqa</dt><dd>Close tab / exit Neovim</dd></div>
              <div><dt>:w</dt><dd>Write current buffer</dd></div>
              <div><dt>:noh</dt><dd>Clear search highlights</dd></div>
              <div><dt>:e about</dt><dd>Jump to section (home, about, projects, contact)</dd></div>
              <div><dt>:resume</dt><dd>Open PDF résumé</dd></div>
              <div><dt>:github</dt><dd>Open GitHub profile</dd></div>
              <div><dt>:whoami</dt><dd>Display user info</dd></div>
            </dl>
          </div>
        </div>
      )}

      {cmdOpen && (
        <div className={styles.nvimCmdContainer}>
          {promptKind === ":" && filteredCommands.length > 0 && (
            <ul className={styles.nvimWildmenu} role="listbox" aria-label="Neovim commands">
              {filteredCommands.map((item, idx) => (
                <li
                  key={item.cmd}
                  role="option"
                  aria-selected={idx === selectedIndex}
                  className={idx === selectedIndex ? styles.nvimWildItemActive : styles.nvimWildItem}
                  onMouseDown={(event) => {
                    event.preventDefault();
                    executeCommand(item.cmd);
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                >
                  <span className={styles.nvimWildCmd}>:{item.cmd}</span>
                  <span className={styles.nvimWildDesc}>{item.description}</span>
                </li>
              ))}
            </ul>
          )}
          <div className={styles.nvimCmdLine}>
            <span className={styles.nvimCmdColon} aria-hidden="true">{promptKind}</span>
            <input
              ref={cmdInputRef}
              type="text"
              autoFocus
              className={styles.nvimCmdInput}
              value={cmdInput}
              placeholder={
                promptKind === "/"
                  ? "Search text on page (press Enter, then n or N to cycle matches)"
                  : "Type a command (q, w, help, e about, resume) and press Enter"
              }
              aria-label={promptKind === "/" ? "Search text on page" : "Neovim command input"}
              onChange={(event) => {
                const val = event.target.value;
                setCmdInput(val);
                setSelectedIndex(0);
                if (promptKind === "/") {
                  runPageSearch(val, false);
                }
              }}
              onKeyDown={handleCmdKeyDown}
              onBlur={() => {
                closeCommandLine();
              }}
            />
          </div>
        </div>
      )}

      <div className={styles.lualineBar}>
        <div className={styles.lualineSide}>
          <span className={styles.lualineMode} role="status" aria-live="polite">
            {mode}
          </span>
          <span className={styles.lualineBranch}>
            <FontAwesomeIcon icon={faCodeBranch} aria-hidden="true" />
            main
          </span>
          <span className={styles.lualineBuffer}>
            {statusMsg ? (
              <span className={statusMsg.isError ? styles.lualineErrorMsg : styles.lualineStatusMsg}>
                {statusMsg.text}
              </span>
            ) : (
              bufferFile
            )}
          </span>
        </div>
        <div className={styles.lualineSide}>
          {keyBuffer && (
            <span className={styles.lualineShowcmd} aria-hidden="true">
              {keyBuffer}
            </span>
          )}
          <a href="/#contact" className={styles.lualineContactLink}>
            Get in touch ↗
          </a>
          <span className={styles.lualineFiletype}>utf8 · unix · yaml</span>
          <span className={styles.lualineProgress}>{scrollLabel}</span>
          <span className={styles.lualineLocation}>{cursorPos}</span>
        </div>
      </div>
    </footer>
  );
}
