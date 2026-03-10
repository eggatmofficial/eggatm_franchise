const Bill = require("../billing/billing.model");

exports.getProfitReport = async (franchiseId) => {

  const now = new Date();

  /* ================= TODAY ================= */

  const todayStart = new Date();
  todayStart.setHours(0,0,0,0);

  const yesterdayStart = new Date(todayStart);
  yesterdayStart.setDate(todayStart.getDate() - 1);

  /* ================= FETCH DATA ================= */

  const bills = await Bill.find({
    franchiseId,
    status: "paid"
  }).lean();

  /* ================= HELPER ================= */

const calculate = (list) => ({
  sales: list.reduce((s,b)=> s + (b.totalAmount || 0), 0),

  cost: list.reduce((s,b)=>
    s + (b.totalCost || 0), 0),

  profit: list.reduce((s,b)=>
    s + (b.totalProfit || 0), 0)
});


  /* ================= TODAY ================= */

  const todayBills = bills.filter(
    b => new Date(b.createdAt) >= todayStart
  );

  /* ================= YESTERDAY ================= */

  const yesterdayBills = bills.filter(b => {
    const d = new Date(b.createdAt);
    return d >= yesterdayStart && d < todayStart;
  });

  /* ================= LAST 7 DAYS ================= */

  const weeklyTrend = [];

  for (let i = 6; i >= 0; i--) {

    const start = new Date();
    start.setHours(0,0,0,0);
    start.setDate(start.getDate() - i);

    const end = new Date(start);
    end.setDate(start.getDate() + 1);

    const dayBills = bills.filter(b => {
      const d = new Date(b.createdAt);
      return d >= start && d < end;
    });

    weeklyTrend.push({
      date: start.toISOString().slice(0,10),
      ...calculate(dayBills)
    });
  }

  /* ================= 12 MONTH TREND ================= */

  const monthlyTrend = [];

  for (let i = 11; i >= 0; i--) {

    const start = new Date(
      now.getFullYear(),
      now.getMonth() - i,
      1
    );

    const end = new Date(
      now.getFullYear(),
      now.getMonth() - i + 1,
      1
    );

    const monthBills = bills.filter(b => {
      const d = new Date(b.createdAt);
      return d >= start && d < end;
    });

    monthlyTrend.push({
      month: start.toLocaleString("default",{month:"short"}),
      ...calculate(monthBills)
    });
  }

  /* ================= FINAL RESPONSE ================= */

  return {
    today: calculate(todayBills),
    yesterday: calculate(yesterdayBills),
    weeklyTrend,
    monthlyTrend
  };
};
