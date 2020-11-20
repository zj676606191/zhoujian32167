function formatDate (value, flg) {
  var date = new Date(value)
  var y = date.getFullYear()
  var MM = date.getMonth() + 1
  MM = MM < 10 ? '0' + MM : MM
  var d = date.getDate()
  d = d < 10 ? '0' + d : d
  if (flg) {
    let h = date.getHours()
    h = h < 10 ? ('0' + h) : h
    let m = date.getMinutes()
    m = m < 10 ? ('0' + m) : m
    let s = date.getSeconds()
    s = s < 10 ? ('0' + s) : s
    return y + '-' + MM + '-' + d + ' ' + h + ':' + m + ':' + s
  }
  return y + '-' + MM + '-' + d
}
export { formatDate }
