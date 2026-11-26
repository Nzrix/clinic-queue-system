package com.clinic.queue.controller;

import com.clinic.queue.dto.QueueEntryRequest;
import com.clinic.queue.dto.QueueEntryResponse;
import com.clinic.queue.service.QueueService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/queue")
@RequiredArgsConstructor
public class QueueController {
    
    private final QueueService queueService;
    
    @GetMapping("/today")
    public ResponseEntity<List<QueueEntryResponse>> getTodayQueue() {
        return ResponseEntity.ok(queueService.getTodayQueue());
    }
    
    @GetMapping
    public ResponseEntity<List<QueueEntryResponse>> getQueueByDate(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(queueService.getQueueByDate(date));
    }
    
    @GetMapping("/display/today")
    public ResponseEntity<List<QueueEntryResponse>> getPublicDisplayQueue() {
        return ResponseEntity.ok(queueService.getTodayQueue());
    }
    
    @PostMapping
    public ResponseEntity<QueueEntryResponse> createQueueEntry(@Valid @RequestBody QueueEntryRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(queueService.createQueueEntry(request));
    }
    
    @PostMapping("/call-next")
    public ResponseEntity<QueueEntryResponse> callNext() {
        return ResponseEntity.ok(queueService.callNext());
    }
    
    @PatchMapping("/{id}/status")
    public ResponseEntity<QueueEntryResponse> updateQueueStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        String status = body.get("status");
        return ResponseEntity.ok(queueService.updateQueueStatus(id, status));
    }
}
