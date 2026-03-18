import { useState, useEffect, useRef } from "react";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  AreaChart, Area, XAxis, YAxis
} from "recharts";

const C = {
  bg: "#F0F4F0",
  card: "#FFFFFF",
  text: "#1C2B1C",
  muted: "#8A9E8A",
  border: "#E4EBE4",
  sage: "#7BA688",
  mint: "#A8D5B5",
  blush: "#F2A8A8",
  peach: "#F5C6A0",
  sky: "#A8C8F2",
  lavender: "#C8A8F2",
  gold: "#F2D4A8",
  cream: "#FDF8F0",
};

const categories = [
  { name: "Food", icon: "🥗", color: C.sage, budget: 600, spent: 412 },
  { name: "Transport", icon: "🚌", color: C.sky, budget: 300, spent: 187 },
  { name: "Shopping", icon: "🛍️", color: C.peach, budget: 400, spent: 391 },
  { name: "Health", icon: "🌿", color: C.mint, budget: 200, spent: 89 },
  { name: "Leisure", icon: "🎨", color: C.lavender, budget: 250, spent: 210 },
  { name: "Bills", icon: "📋", color: C.blush, budget: 800, spent: 750 },
];

const spendingData = [
  { week: "W1", amount: 480 },
  { week: "W2", amount: 620 },
  { week: "W3", amount: 390 },
  { week: "W4", amount: 710 },
  { week: "W5", amount: 540 },
  { week: "W6", amount: 830 },
  { week: "W7", amount: 560 },
];

const budgetGoals = [
  { name: "Vacation Fund", target: 3000, saved: 1840, icon: "✈️", color: C.sky },
  { name: "Emergency Fund", target: 5000, saved: 3200, icon: "🛡️", color: C.mint },
  { name: "New Laptop", target: 1500, saved: 950, icon: "💻", color: C.lavender },
];

const tabs = ["Summary", "Categories", "Goals"];

function AnimatedRing({ pct, color, size = 72, stroke = 7 }) {
  const r = (size - stroke * 2) / 2;
  const circ = 2 * Math.PI * r;
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setProgress(pct), 200);
    return () => clearTimeout(t);
  }, [pct]);
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={C.border} strokeWidth={stroke} />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={color} strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={circ * (1 - progress / 100)}
        style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.34,1.56,0.64,1)" }}
      />
    </svg>
  );
}

function AnimatedBar({ pct, color }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(pct), 300);
    return () => clearTimeout(t);
  }, [pct]);
  return (
    <div style={{ height: 10, borderRadius: 99, background: C.border, overflow: "hidden", flex: 1 }}>
      <div style={{
        height: "100%", borderRadius: 99,
        background: `linear-gradient(90deg, ${color}, ${color}cc)`,
        width: `${width}%`,
        transition: "width 1.1s cubic-bezier(0.34,1.56,0.64,1)",
      }} />
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: C.card, border: `1px solid ${C.border}`,
        borderRadius: 12, padding: "8px 14px", fontSize: 12,
        boxShadow: "0 4px 20px rgba(28,43,28,0.08)"
      }}>
        <div style={{ color: C.muted, marginBottom: 2 }}>{label}</div>
        <div style={{ color: C.text, fontWeight: 700 }}>R{payload[0].value}</div>
      </div>
    );
  }
  return null;
};

const totalSpent = categories.reduce((s, c) => s + c.spent, 0);
const totalBudget = categories.reduce((s, c) => s + c.budget, 0);

export default function ExpenseTracker() {
  const [activeTab, setActiveTab] = useState("Summary");
  const [selectedCat, setSelectedCat] = useState(null);

  const overPct = Math.round((totalSpent / totalBudget) * 100);

  return (
    <div style={{
      fontFamily: "'Lora', 'Georgia', serif",
      background: C.bg,
      minHeight: "100vh",
      maxWidth: 430,
      margin: "0 auto",
      paddingBottom: 90,
      position: "relative",
      overflowX: "hidden",
    }}>
      {/* Background organic blobs */}
      <div style={{
        position: "fixed", top: -80, left: -60, width: 280, height: 280,
        borderRadius: "60% 40% 55% 45% / 50% 60% 40% 50%",
        background: "radial-gradient(circle, rgba(168,213,181,0.25) 0%, transparent 70%)",
        pointerEvents: "none", zIndex: 0,
      }} />
      <div style={{
        position: "fixed", bottom: 100, right: -80, width: 300, height: 300,
        borderRadius: "45% 55% 40% 60% / 60% 40% 60% 40%",
        background: "radial-gradient(circle, rgba(242,212,168,0.2) 0%, transparent 70%)",
        pointerEvents: "none", zIndex: 0,
      }} />

      {/* Header */}
      <div style={{
        position: "sticky", top: 0, zIndex: 10,
        background: "rgba(240,244,240,0.88)",
        backdropFilter: "blur(18px)",
        padding: "22px 20px 14px",
        borderBottom: `1px solid ${C.border}`,
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontSize: 11, color: C.muted, letterSpacing: 2, textTransform: "uppercase", marginBottom: 3 }}>
              March 2026
            </div>
            <div style={{ fontSize: 26, fontWeight: 700, color: C.text, letterSpacing: -0.5, lineHeight: 1 }}>
              Spending
            </div>
          </div>
          <div style={{
            background: C.sage, color: "#fff",
            borderRadius: 14, padding: "6px 14px",
            fontSize: 13, fontWeight: 600,
            fontFamily: "'DM Sans', sans-serif",
          }}>
            R{totalSpent.toLocaleString()} <span style={{ opacity: 0.75, fontWeight: 400 }}>/ R{totalBudget.toLocaleString()}</span>
          </div>
        </div>

        {/* Tabs */}
        <div style={{
          display: "flex", gap: 4, marginTop: 14,
          background: C.border, borderRadius: 12, padding: 4,
        }}>
          {tabs.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              flex: 1, padding: "8px 0",
              borderRadius: 9, border: "none", cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 12,
              transition: "all 0.25s",
              background: activeTab === tab ? C.card : "transparent",
              color: activeTab === tab ? C.text : C.muted,
              boxShadow: activeTab === tab ? "0 2px 8px rgba(28,43,28,0.08)" : "none",
            }}>{tab}</button>
          ))}
        </div>
      </div>

      <div style={{ padding: "16px 16px 0", position: "relative", zIndex: 1 }}>

        {/* ── SUMMARY TAB ── */}
        {activeTab === "Summary" && (
          <>
            {/* Big ring + total */}
            <div style={{
              background: C.card, borderRadius: 24, padding: "24px 20px",
              boxShadow: "0 2px 20px rgba(28,43,28,0.06)",
              border: `1px solid ${C.border}`, marginBottom: 14,
              display: "flex", alignItems: "center", gap: 20,
            }}>
              <div style={{ position: "relative", flexShrink: 0 }}>
                <AnimatedRing pct={overPct} color={overPct > 85 ? C.blush : C.sage} size={90} stroke={9} />
                <div style={{
                  position: "absolute", inset: 0,
                  display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center",
                }}>
                  <span style={{ fontSize: 16, fontWeight: 700, color: C.text }}>{overPct}%</span>
                  <span style={{ fontSize: 9, color: C.muted, fontFamily: "'DM Sans', sans-serif" }}>used</span>
                </div>
              </div>
              <div>
                <div style={{ fontSize: 13, color: C.muted, fontFamily: "'DM Sans', sans-serif", marginBottom: 4 }}>
                  Remaining budget
                </div>
                <div style={{ fontSize: 32, fontWeight: 700, color: C.text, letterSpacing: -1 }}>
                  R{(totalBudget - totalSpent).toLocaleString()}
                </div>
                <div style={{ fontSize: 12, color: C.muted, fontFamily: "'DM Sans', sans-serif", marginTop: 4 }}>
                  of R{totalBudget.toLocaleString()} monthly budget
                </div>
              </div>
            </div>

            {/* Spending trend */}
            <div style={{
              background: C.card, borderRadius: 24, padding: "20px 16px",
              boxShadow: "0 2px 20px rgba(28,43,28,0.06)",
              border: `1px solid ${C.border}`, marginBottom: 14,
            }}>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, color: C.text, fontSize: 14, marginBottom: 4 }}>
                Weekly Spending
              </div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: C.muted, marginBottom: 14 }}>
                Last 7 weeks
              </div>
              <ResponsiveContainer width="100%" height={140}>
                <AreaChart data={spendingData}>
                  <defs>
                    <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={C.sage} stopOpacity={0.3} />
                      <stop offset="100%" stopColor={C.sage} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="week" tick={{ fontSize: 10, fill: C.muted, fontFamily: "'DM Sans', sans-serif" }} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="amount" stroke={C.sage} strokeWidth={2.5} fill="url(#spendGrad)" dot={{ r: 3, fill: C.sage, strokeWidth: 0 }} activeDot={{ r: 5, fill: C.sage }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Donut breakdown */}
            <div style={{
              background: C.card, borderRadius: 24, padding: "20px 16px",
              boxShadow: "0 2px 20px rgba(28,43,28,0.06)",
              border: `1px solid ${C.border}`,
            }}>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, color: C.text, fontSize: 14, marginBottom: 14 }}>
                Spend by Category
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <ResponsiveContainer width={130} height={130}>
                  <PieChart>
                    <Pie data={categories} dataKey="spent" innerRadius={38} outerRadius={60} paddingAngle={3} startAngle={90} endAngle={-270}>
                      {categories.map((c, i) => <Cell key={i} fill={c.color} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
                  {categories.map(c => (
                    <div key={c.name} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: c.color, flexShrink: 0 }} />
                      <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: C.text, flex: 1 }}>{c.name}</span>
                      <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 700, color: C.muted }}>R{c.spent}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* ── CATEGORIES TAB ── */}
        {activeTab === "Categories" && (
          <>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, color: C.text, fontSize: 15, marginBottom: 14 }}>
              Budget vs Spent
            </div>
            {categories.map((cat, i) => {
              const pct = Math.round((cat.spent / cat.budget) * 100);
              const over = pct >= 90;
              return (
                <div key={cat.name}
                  onClick={() => setSelectedCat(selectedCat === cat.name ? null : cat.name)}
                  style={{
                    background: selectedCat === cat.name ? cat.color + "18" : C.card,
                    borderRadius: 20, padding: "16px",
                    boxShadow: "0 2px 16px rgba(28,43,28,0.05)",
                    border: `1px solid ${selectedCat === cat.name ? cat.color + "60" : C.border}`,
                    marginBottom: 10, cursor: "pointer",
                    transition: "all 0.2s",
                    animation: `fadeUp 0.4s ease ${i * 0.07}s both`,
                  }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: 14, flexShrink: 0,
                      background: cat.color + "22",
                      display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
                    }}>{cat.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                        <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, color: C.text, fontSize: 14 }}>{cat.name}</span>
                        <span style={{
                          fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 700,
                          color: over ? C.blush : C.sage,
                          background: over ? C.blush + "22" : C.sage + "22",
                          borderRadius: 20, padding: "2px 8px",
                        }}>{pct}%</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <AnimatedBar pct={pct} color={over ? C.blush : cat.color} />
                      </div>
                    </div>
                  </div>
                  {selectedCat === cat.name && (
                    <div style={{
                      marginTop: 14, paddingTop: 14,
                      borderTop: `1px solid ${C.border}`,
                      display: "flex", justifyContent: "space-around",
                      animation: "fadeUp 0.2s ease both",
                    }}>
                      {[
                        { label: "Spent", val: `R${cat.spent}`, color: C.text },
                        { label: "Budget", val: `R${cat.budget}`, color: C.muted },
                        { label: "Left", val: `R${cat.budget - cat.spent}`, color: cat.budget - cat.spent < 50 ? C.blush : C.sage },
                      ].map(d => (
                        <div key={d.label} style={{ textAlign: "center" }}>
                          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: C.muted, marginBottom: 4 }}>{d.label}</div>
                          <div style={{ fontWeight: 700, fontSize: 16, color: d.color }}>{d.val}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </>
        )}

        {/* ── GOALS TAB ── */}
        {activeTab === "Goals" && (
          <>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, color: C.text, fontSize: 15, marginBottom: 6 }}>
              Savings Goals
            </div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: C.muted, marginBottom: 16 }}>
              Tap a goal to see details
            </div>
            {budgetGoals.map((goal, i) => {
              const pct = Math.round((goal.saved / goal.target) * 100);
              return (
                <div key={goal.name} style={{
                  background: C.card, borderRadius: 24, padding: "20px",
                  boxShadow: "0 2px 20px rgba(28,43,28,0.06)",
                  border: `1px solid ${C.border}`, marginBottom: 14,
                  animation: `fadeUp 0.4s ease ${i * 0.1}s both`,
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
                    <div style={{ position: "relative", flexShrink: 0 }}>
                      <AnimatedRing pct={pct} color={goal.color} size={68} stroke={7} />
                      <div style={{
                        position: "absolute", inset: 0,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 20,
                      }}>{goal.icon}</div>
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, color: C.text, fontSize: 16, marginBottom: 4 }}>{goal.name}</div>
                      <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: C.muted }}>
                        {pct}% of goal reached
                      </div>
                    </div>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                    <div>
                      <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: 1 }}>Saved</div>
                      <div style={{ fontWeight: 700, fontSize: 18, color: C.text }}>R{goal.saved.toLocaleString()}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: 1 }}>Target</div>
                      <div style={{ fontWeight: 700, fontSize: 18, color: C.muted }}>R{goal.target.toLocaleString()}</div>
                    </div>
                  </div>
                  <AnimatedBar pct={pct} color={goal.color} />
                  <div style={{
                    marginTop: 14, fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: C.muted,
                    background: goal.color + "15", borderRadius: 10, padding: "8px 12px",
                    display: "flex", alignItems: "center", gap: 6,
                  }}>
                    <span style={{ fontSize: 14 }}>💡</span>
                    <span>R{(goal.target - goal.saved).toLocaleString()} left — you're on track!</span>
                  </div>
                </div>
              );
            })}

            {/* Add goal CTA */}
            <div style={{
              border: `2px dashed ${C.border}`, borderRadius: 24, padding: "20px",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
              cursor: "pointer", color: C.muted, fontFamily: "'DM Sans', sans-serif",
              fontSize: 13, fontWeight: 600,
            }}>
              <span style={{ fontSize: 20 }}>＋</span> Add new goal
            </div>
          </>
        )}
      </div>

      {/* Bottom nav */}
      <div style={{
        position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
        width: "100%", maxWidth: 430,
        background: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(20px)",
        borderTop: `1px solid ${C.border}`,
        display: "flex", justifyContent: "space-around",
        padding: "12px 0 22px", zIndex: 20,
      }}>
        {[
          { icon: "🏠", label: "Home" },
          { icon: "📊", label: "Stats" },
          { icon: "➕", label: "Add" },
          { icon: "🎯", label: "Goals" },
          { icon: "👤", label: "Profile" },
        ].map((item, i) => (
          <button key={item.label} style={{
            background: i === 2
              ? `linear-gradient(135deg, ${C.sage}, ${C.mint})`
              : "none",
            border: "none", cursor: "pointer",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
            fontFamily: "'DM Sans', sans-serif",
            width: i === 2 ? 48 : "auto",
            height: i === 2 ? 48 : "auto",
            borderRadius: i === 2 ? "50%" : 0,
            marginTop: i === 2 ? -14 : 0,
            boxShadow: i === 2 ? "0 4px 16px rgba(123,166,136,0.45)" : "none",
            justifyContent: "center",
          }}>
            <span style={{ fontSize: i === 2 ? 22 : 18 }}>{item.icon}</span>
            {i !== 2 && <span style={{ fontSize: 9, color: i === 0 ? C.sage : C.muted, fontWeight: i === 0 ? 700 : 400 }}>{item.label}</span>}
          </button>
        ))}
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}