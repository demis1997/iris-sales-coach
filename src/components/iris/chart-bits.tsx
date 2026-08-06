export const chartTooltip = {
  cursor: { stroke: "var(--border)" },
  contentStyle: {
    background: "var(--popover)",
    border: "1px solid var(--border)",
    borderRadius: "12px",
    fontSize: "12px",
    color: "var(--popover-foreground)",
    boxShadow: "0 12px 40px -12px rgba(0,0,0,0.6)",
  },
  labelStyle: { color: "var(--muted-foreground)", marginBottom: 4 },
  itemStyle: { color: "var(--popover-foreground)" },
} as const;

export const axisProps = {
  tickLine: false,
  axisLine: false,
  fontSize: 11,
  stroke: "var(--muted-foreground)",
} as const;
