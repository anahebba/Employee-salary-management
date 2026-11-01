package com.acme.salary.report;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.*;
import java.io.ByteArrayOutputStream;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.apache.poi.ss.usermodel.*;
@RestController @RequestMapping("/api/reports") @CrossOrigin(origins="http://localhost:5173")
public class ReportController {
 private final ReportService service;
 public ReportController(ReportService service){this.service=service;}
 @GetMapping("/templates") public List<Map<String,String>> templates(){return List.of(
  Map.of("id","employee_directory","name","Employee Directory","description","Employee and employment details"),
  Map.of("id","current_salary","name","Current Salary Report","description","Current compensation by employee"),
  Map.of("id","salary_revisions","name","Salary Revision Report","description","Salary changes within a date range"),
  Map.of("id","upcoming_salary_changes","name","Upcoming Salary Changes","description","Future-dated compensation changes"),
  Map.of("id","employees_without_salary","name","Employees Without Current Salary","description","Active employees needing salary records"),
  Map.of("id","country_payroll","name","Country Payroll Report","description","Current annual payroll by country and currency"),
  Map.of("id","salary_outliers","name","Salary Outlier Report","description","Potential salary outliers against peer percentiles")
 );}
 @GetMapping public List<Map<String,Object>> run(@RequestParam String type,@RequestParam(required=false) String country,@RequestParam(required=false) String department,@RequestParam(required=false) String status,@RequestParam(required=false) String search,@RequestParam(required=false) @DateTimeFormat(iso=DateTimeFormat.ISO.DATE) LocalDate from,@RequestParam(required=false) @DateTimeFormat(iso=DateTimeFormat.ISO.DATE) LocalDate to,@RequestParam(required=false) String columns){return selectColumns(service.run(type,clean(country),clean(department),clean(status),clean(search),from,to),columns);}
 @GetMapping("/saved") public List<Map<String,Object>> saved(){return service.saved();}
 @PostMapping("/saved") public Map<String,Object> save(@RequestBody SaveReportRequest request){return service.save(request.name(),request.reportType(),request.configuration());}
 @DeleteMapping("/saved/{id}") public void delete(@PathVariable Long id){service.delete(id);}
 @GetMapping(value="/export",produces="text/csv") public ResponseEntity<String> export(@RequestParam String type,@RequestParam(required=false) String country,@RequestParam(required=false) String department,@RequestParam(required=false) String status,@RequestParam(required=false) String search,@RequestParam(required=false) @DateTimeFormat(iso=DateTimeFormat.ISO.DATE) LocalDate from,@RequestParam(required=false) @DateTimeFormat(iso=DateTimeFormat.ISO.DATE) LocalDate to,@RequestParam(required=false) String columns){
  List<Map<String,Object>> rows=selectColumns(service.run(type,clean(country),clean(department),clean(status),clean(search),from,to),columns); StringBuilder csv=new StringBuilder();
  if(!rows.isEmpty()){List<String> headers=new ArrayList<>(rows.get(0).keySet());csv.append(headers.stream().map(this::quote).reduce((a,b)->a+","+b).orElse("")).append("\r\n");for(Map<String,Object> row:rows){csv.append(headers.stream().map(h->quote(row.get(h))).reduce((a,b)->a+","+b).orElse("")).append("\r\n");}}
  return ResponseEntity.ok().header(HttpHeaders.CONTENT_DISPOSITION,"attachment; filename=acme-"+type+".csv").contentType(MediaType.parseMediaType("text/csv; charset=UTF-8")).body(csv.toString());
 }
 @GetMapping(value="/export", params="format=xlsx", produces="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
 public ResponseEntity<byte[]> exportExcel(@RequestParam String type,@RequestParam(required=false) String country,@RequestParam(required=false) String department,@RequestParam(required=false) String status,@RequestParam(required=false) String search,@RequestParam(required=false) @DateTimeFormat(iso=DateTimeFormat.ISO.DATE) LocalDate from,@RequestParam(required=false) @DateTimeFormat(iso=DateTimeFormat.ISO.DATE) LocalDate to,@RequestParam(required=false) String columns) throws Exception {
  List<Map<String,Object>> rows=selectColumns(service.run(type,clean(country),clean(department),clean(status),clean(search),from,to),columns);
  try(XSSFWorkbook workbook=new XSSFWorkbook(); ByteArrayOutputStream out=new ByteArrayOutputStream()) {
   Sheet sheet=workbook.createSheet("Report");
   if(!rows.isEmpty()) {
    CellStyle header=workbook.createCellStyle(); Font font=workbook.createFont(); font.setBold(true); header.setFont(font);
    Row head=sheet.createRow(0); List<String> keys=new ArrayList<>(rows.get(0).keySet());
    for(int c=0;c<keys.size();c++){Cell cell=head.createCell(c);cell.setCellValue(keys.get(c));cell.setCellStyle(header);}
    for(int r=0;r<rows.size();r++){Row row=sheet.createRow(r+1);for(int c=0;c<keys.size();c++){Object value=rows.get(r).get(keys.get(c));Cell cell=row.createCell(c);cell.setCellValue(value==null?"":value.toString());}}
    for(int c=0;c<keys.size();c++) sheet.autoSizeColumn(c);
   }
   workbook.write(out);
   return ResponseEntity.ok().header(HttpHeaders.CONTENT_DISPOSITION,"attachment; filename=acme-"+type+".xlsx").contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")).body(out.toByteArray());
  }
 }
 private List<Map<String,Object>> selectColumns(List<Map<String,Object>> rows,String columns){
  if(columns==null||columns.isBlank()||rows.isEmpty()) return rows;
  List<String> requested=Arrays.stream(columns.split(",")).map(String::trim).filter(s->!s.isBlank()).toList();
  List<String> allowed=new ArrayList<>(rows.get(0).keySet());
  List<String> selected=requested.stream().filter(allowed::contains).toList();
  if(selected.isEmpty()) return rows;
  return rows.stream().map(row->{Map<String,Object> result=new LinkedHashMap<>();selected.forEach(k->result.put(k,row.get(k)));return result;}).toList();
 }
 private String quote(Object value){String s=value==null?"":value.toString();return "\""+s.replace("\"","\"\"")+"\"";}
 private String clean(String s){return s==null||s.isBlank()||"ALL".equalsIgnoreCase(s)?null:s;}
 public record SaveReportRequest(String name,String reportType,String configuration){}
}
