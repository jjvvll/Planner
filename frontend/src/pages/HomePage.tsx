import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useLogout } from "@/hooks/useAuth";
import styles from "./HomePage.module.css";

// ── Helpers ───────────────────────────────────────────────────────────────────

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
}

function buildCalendarDays(year: number, month: number): CalendarDay[] {
  const today = new Date();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const days: CalendarDay[] = [];

  // Pad start with previous month days
  for (let i = 0; i < firstDay.getDay(); i++) {
    const date = new Date(year, month, -firstDay.getDay() + i + 1);
    days.push({ date, isCurrentMonth: false, isToday: false });
  }

  // Current month days
  for (let d = 1; d <= lastDay.getDate(); d++) {
    const date = new Date(year, month, d);
    days.push({
      date,
      isCurrentMonth: true,
      isToday:
        date.getFullYear() === today.getFullYear() &&
        date.getMonth() === today.getMonth() &&
        date.getDate() === today.getDate(),
    });
  }

  // Pad end to complete the last row
  const remaining = 7 - (days.length % 7);
  if (remaining < 7) {
    for (let i = 1; i <= remaining; i++) {
      const date = new Date(year, month + 1, i);
      days.push({ date, isCurrentMonth: false, isToday: false });
    }
  }

  return days;
}

// ── Dummy event data (replace with API data later) ────────────────────────────

type EventType = "grocery" | "bill" | "income" | "task";

interface CalEvent {
  date: string; // yyyy-MM-dd
  label: string;
  type: EventType;
}

const SAMPLE_EVENTS: CalEvent[] = [
  { date: "2026-04-01", label: "💳 Salary", type: "income" },
  { date: "2026-04-02", label: "⚡ Electric bill", type: "bill" },
  { date: "2026-04-03", label: "Doctor appt", type: "task" },
  { date: "2026-04-05", label: "🛒 Groceries", type: "grocery" },
  { date: "2026-04-07", label: "🌐 Internet", type: "bill" },
  { date: "2026-04-10", label: "Car wash", type: "task" },
  { date: "2026-04-12", label: "🛒 Groceries", type: "grocery" },
  { date: "2026-04-12", label: "🏠 Rent", type: "bill" },
  { date: "2026-04-15", label: "💳 Freelance", type: "income" },
  { date: "2026-04-19", label: "🛒 Groceries", type: "grocery" },
  { date: "2026-04-22", label: "Birthday gift", type: "task" },
  { date: "2026-04-26", label: "🛒 Groceries", type: "grocery" },
  { date: "2026-04-30", label: "📱 Phone bill", type: "bill" },
];

function getEventsForDate(date: Date): CalEvent[] {
  const key = date.toISOString().split("T")[0];
  return SAMPLE_EVENTS.filter((e) => e.date === key);
}

function pillClass(type: EventType, styles: Record<string, string>): string {
  const map: Record<EventType, string> = {
    grocery: styles.pillGreen,
    bill: styles.pillAmber,
    income: styles.pillBlue,
    task: styles.pillCoral,
  };
  return map[type];
}

// ── Nav items ─────────────────────────────────────────────────────────────────

function CalendarIcon() {
  return (
    <svg
      className={styles.navIcon}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <rect x="1" y="2" width="14" height="13" rx="2" />
      <path d="M5 1v2M11 1v2M1 6h14" />
    </svg>
  );
}
function BillIcon() {
  return (
    <svg
      className={styles.navIcon}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M2 4h12v9H2zM2 7h12" />
      <path d="M5 10h2" />
    </svg>
  );
}
function CashIcon() {
  return (
    <svg
      className={styles.navIcon}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M8 2v12M4 6l4-4 4 4M4 10l4 4 4-4" />
    </svg>
  );
}
function GroceryIcon() {
  return (
    <svg
      className={styles.navIcon}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M2 3h2l2 7h6l2-5H6" />
      <circle cx="7" cy="13" r="1" />
      <circle cx="12" cy="13" r="1" />
    </svg>
  );
}
function BellIcon() {
  return (
    <svg
      className={styles.navIcon}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M8 1a5 5 0 0 1 5 5v3l1 2H2l1-2V6a5 5 0 0 1 5-5z" />
      <path d="M6.5 13a1.5 1.5 0 0 0 3 0" />
    </svg>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function HomePage() {
  const { user } = useAuth();
  const { mutate: logout } = useLogout();

  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());

  const calDays = buildCalendarDays(currentYear, currentMonth);

  function prevMonth() {
    if (currentMonth === 0) {
      setCurrentYear((y) => y - 1);
      setCurrentMonth(11);
    } else setCurrentMonth((m) => m - 1);
  }

  function nextMonth() {
    if (currentMonth === 11) {
      setCurrentYear((y) => y + 1);
      setCurrentMonth(0);
    } else setCurrentMonth((m) => m + 1);
  }

  return (
    <div className={styles.root}>
      {/* ── Sidebar ── */}
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          Plan<span>ner</span>
        </div>

        <div className={styles.navSection}>Overview</div>
        <a className={`${styles.navItem} ${styles.navItemActive}`} href="#">
          <CalendarIcon /> Calendar
        </a>
        <a className={styles.navItem} href="#">
          <BellIcon /> Reminders
        </a>

        <div className={styles.navSection}>Finance</div>
        <a className={styles.navItem} href="#">
          <BillIcon /> Bills
        </a>
        <a className={styles.navItem} href="#">
          <CashIcon /> Cash Flow
        </a>

        <div className={styles.navSection}>Shopping</div>
        <a className={styles.navItem} href="#">
          <GroceryIcon /> Grocery Lists
        </a>

        <div className={styles.sidebarSpacer} />

        <div className={styles.reminderBadge}>
          <div className={styles.reminderBadgeTitle}>Email reminders on</div>
          <div className={styles.reminderBadgeText}>
            Next: Today — Groceries
          </div>
        </div>

        {/* User row */}
        <div className={styles.userRow}>
          <div className={styles.avatar}>
            {user ? getInitials(user.name) : "?"}
          </div>
          <div style={{ minWidth: 0 }}>
            <div className={styles.userName}>{user?.name ?? "—"}</div>
            <div className={styles.userEmail}>{user?.email ?? "—"}</div>
          </div>
          <button
            className={styles.logoutBtn}
            onClick={() => logout()}
            title="Sign out"
          >
            ↪
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className={styles.main}>
        {/* Topbar */}
        <div className={styles.topbar}>
          <div className={styles.topbarTitle}>
            {MONTH_NAMES[currentMonth]} {currentYear}
          </div>
          <div className={styles.topbarActions}>
            <button className={styles.btnOutline}>Month</button>
            <button className={styles.btnOutline}>Week</button>
            <button className={styles.btnPrimary}>+ Add Event</button>
          </div>
        </div>

        {/* Calendar */}
        <div className={styles.content}>
          <div className={styles.monthNav}>
            <button className={styles.monthArrow} onClick={prevMonth}>
              ‹
            </button>
            <span className={styles.monthLabel}>
              {MONTH_NAMES[currentMonth]} {currentYear}
            </span>
            <button className={styles.monthArrow} onClick={nextMonth}>
              ›
            </button>

            <div className={styles.legendRow}>
              <span className={`${styles.legendTag} ${styles.legendGreen}`}>
                Grocery
              </span>
              <span className={`${styles.legendTag} ${styles.legendAmber}`}>
                Bill
              </span>
              <span className={`${styles.legendTag} ${styles.legendBlue}`}>
                Income
              </span>
              <span className={`${styles.legendTag} ${styles.legendCoral}`}>
                Task
              </span>
            </div>
          </div>

          <div className={styles.calGrid}>
            {/* Day headers */}
            {DAYS_OF_WEEK.map((d) => (
              <div key={d} className={styles.calHeader}>
                {d}
              </div>
            ))}

            {/* Day cells */}
            {calDays.map((day, idx) => {
              const events = getEventsForDate(day.date);
              return (
                <div
                  key={idx}
                  className={[
                    styles.calDay,
                    day.isToday ? styles.calDayToday : "",
                    !day.isCurrentMonth ? styles.calDayOtherMonth : "",
                  ].join(" ")}
                >
                  <div className={styles.dayNum}>{day.date.getDate()}</div>
                  {events.slice(0, 3).map((ev, i) => (
                    <span
                      key={i}
                      className={`${styles.pill} ${pillClass(ev.type, styles)}`}
                    >
                      {ev.label}
                    </span>
                  ))}
                  {events.length > 3 && (
                    <span className={`${styles.pill} ${styles.pillCoral}`}>
                      +{events.length - 3} more
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* ── Right panel ── */}
      <aside className={styles.rightPanel}>
        {/* Today */}
        <div>
          <div className={styles.panelSectionTitle}>
            Today — {MONTH_NAMES[today.getMonth()]} {today.getDate()}
          </div>
          <div
            className={`${styles.reminderItem} ${styles.reminderItemHighlight}`}
          >
            <div
              className={styles.reminderDot}
              style={{ background: "#1d9e75" }}
            />
            <div>
              <div className={styles.reminderText}>Buy groceries tomorrow</div>
              <div className={styles.reminderTime}>
                Email reminder scheduled
              </div>
            </div>
          </div>
          <div className={styles.reminderItem}>
            <div
              className={styles.reminderDot}
              style={{ background: "#d85a30" }}
            />
            <div>
              <div className={styles.reminderText}>Doctor appointment</div>
              <div className={styles.reminderTime}>
                2:00 PM · reminder sent ✓
              </div>
            </div>
          </div>
        </div>

        {/* Budget */}
        <div>
          <div className={styles.panelSectionTitle}>
            {MONTH_NAMES[currentMonth]} Budget
          </div>
          <div className={styles.budgetRow}>
            <span className={styles.budgetLabel}>Income</span>
            <span className={styles.budgetIncome}>+₱48,000</span>
          </div>
          <div className={styles.budgetRow}>
            <span className={styles.budgetLabel}>Bills</span>
            <span className={styles.budgetExpense}>−₱12,400</span>
          </div>
          <div className={styles.budgetRow}>
            <span className={styles.budgetLabel}>Groceries</span>
            <span className={styles.budgetExpense}>−₱8,200</span>
          </div>
          <div className={`${styles.budgetRow} ${styles.budgetRowLast}`}>
            <span className={`${styles.budgetLabel} ${styles.budgetLabelBold}`}>
              Remaining
            </span>
            <span className={styles.budgetIncome}>₱27,400</span>
          </div>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: "57%" }} />
          </div>
          <div className={styles.progressLabel}>57% of budget remaining</div>
        </div>

        {/* Upcoming bills */}
        <div>
          <div className={styles.panelSectionTitle}>Upcoming Bills</div>
          <div className={styles.reminderItem}>
            <div
              className={styles.reminderDot}
              style={{ background: "#ef9f27" }}
            />
            <div>
              <div className={styles.reminderText}>Internet — ₱1,299</div>
              <div className={styles.reminderTime}>Apr 7 · in 4 days</div>
            </div>
          </div>
          <div className={styles.reminderItem}>
            <div
              className={styles.reminderDot}
              style={{ background: "#ef9f27" }}
            />
            <div>
              <div className={styles.reminderText}>Rent — ₱8,000</div>
              <div className={styles.reminderTime}>Apr 12 · in 9 days</div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
