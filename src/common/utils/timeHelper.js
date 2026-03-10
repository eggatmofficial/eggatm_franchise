

const dayjs = require("dayjs")
const utc = require("dayjs/plugin/utc")
const timezone = require("dayjs/plugin/timezone")

dayjs.extend(utc)
dayjs.extend(timezone)

const TZ = "Asia/Kolkata"

/* Convert UTC → IST */
exports.convertToIST = (date) => {
  return dayjs(date).tz(TZ).format("YYYY-MM-DD HH:mm:ss")
}

/* Current IST time */
exports.nowIST = () => {
  return dayjs().tz(TZ).toDate()
}

/* Start of today IST */
exports.getTodayStart = () => {
  return dayjs().tz(TZ).startOf("day").toDate()
}

/* End of today IST */
exports.getTodayEnd = () => {
  return dayjs().tz(TZ).endOf("day").toDate()
}

/* Last 7 days range */
exports.getLast7DaysStart = () => {
  return dayjs().tz(TZ).subtract(6, "day").startOf("day").toDate()
}

/* Start of current month */
exports.getMonthStart = () => {
  return dayjs().tz(TZ).startOf("month").toDate()
}

/* End of current month */
exports.getMonthEnd = () => {
  return dayjs().tz(TZ).endOf("month").toDate()
}

/* Start & End of year */
exports.getYearRange = (year) => {
  return {
    start: dayjs().tz(TZ).year(year).startOf("year").toDate(),
    end: dayjs().tz(TZ).year(year).endOf("year").toDate()
  }
}

/* Today Range */
exports.getTodayRange = () => {
  return {
    start: dayjs().tz(TZ).startOf("day").toDate(),
    end: dayjs().tz(TZ).endOf("day").toDate()
  }
}

/* Yesterday Range */
exports.getYesterdayRange = () => {
  return {
    start: dayjs().tz(TZ).subtract(1,"day").startOf("day").toDate(),
    end: dayjs().tz(TZ).subtract(1,"day").endOf("day").toDate()
  }
}