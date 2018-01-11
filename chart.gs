function myPIEChartFunction() {
  var sheet=SpreadsheetApp.getActiveSheet();
  var range=sheet.getRange("A2:B10");
  var chart=sheet.newChart()
  .addRange(range)
  .setChartType(Charts.ChartType.PIE)
  .setPosition(2,5,0,0)
  .setOption('title','科目別平均点');
  sheet.insertChart(chart.build());
}
