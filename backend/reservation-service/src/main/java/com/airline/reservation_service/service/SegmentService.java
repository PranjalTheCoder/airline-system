package com.airline.reservation_service.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.airline.reservation_service.dto.SegmentDTO;
import com.airline.reservation_service.entity.ItinerarySegment;
import com.airline.reservation_service.entity.Pnr;
import com.airline.reservation_service.repository.PnrRepository;
import com.airline.reservation_service.repository.SegmentRepository;

@Service
public class SegmentService {

    private final SegmentRepository repo;
    private final PnrRepository pnrRepo;

    public SegmentService(SegmentRepository repo, PnrRepository pnrRepo) {
        this.repo = repo;
        this.pnrRepo = pnrRepo;
    }

    public ItinerarySegment add(String code, SegmentDTO dto){
        Pnr pnr = pnrRepo.findByPnrCode(code).orElseThrow();

        ItinerarySegment s = new ItinerarySegment();
        s.setFlightInstanceId(dto.getFlightInstanceId());
        s.setFareClassId(dto.getFareClassId());
        s.setSegmentStatus("HOLD");
        s.setPnr(pnr);

        return repo.save(s);
    }

    public List<ItinerarySegment> get(String code){
        Pnr pnr = pnrRepo.findByPnrCode(code).orElseThrow();
        return repo.findByPnrId(pnr.getId());
    }

    public ItinerarySegment getOne(Long id){
        return repo.findById(id).orElseThrow();
    }

    public ItinerarySegment update(Long id, SegmentDTO dto){
        ItinerarySegment s = getOne(id);
        s.setFareClassId(dto.getFareClassId());
        return repo.save(s);
    }

    public void delete(Long id){
        repo.deleteById(id);
    }
}