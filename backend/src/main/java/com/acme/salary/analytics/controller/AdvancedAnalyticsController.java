package com.acme.salary.analytics.controller;
import com.acme.salary.analytics.service.AdvancedAnalyticsService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.Map;
@RestController
@RequestMapping("/api/analytics")
@CrossOrigin(origins = "http://localhost:5173")
public class AdvancedAnalyticsController {
 private final AdvancedAnalyticsService service;
 public AdvancedAnalyticsController(AdvancedAnalyticsService service){this.service=service;}
 @GetMapping("/dashboard")
 public Map<String,Object> dashboard(
   @RequestParam(required=false) @DateTimeFormat(iso=DateTimeFormat.ISO.DATE) LocalDate from,
   @RequestParam(required=false) @DateTimeFormat(iso=DateTimeFormat.ISO.DATE) LocalDate to,
   @RequestParam(required=false) String country,
   @RequestParam(required=false) String department){
   return service.dashboard(from,to,blank(country),blank(department));
 }
 private String blank(String value){return value==null||value.isBlank()||"ALL".equalsIgnoreCase(value)?null:value;}
}
