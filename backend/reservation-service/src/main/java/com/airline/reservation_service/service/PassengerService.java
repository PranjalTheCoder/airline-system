package com.airline.reservation_service.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.airline.reservation_service.dto.PassengerDTO;
import com.airline.reservation_service.entity.Pnr;
import com.airline.reservation_service.entity.PnrPassenger;
import com.airline.reservation_service.repository.PassengerRepository;
import com.airline.reservation_service.repository.PnrRepository;

@Service
public class PassengerService {

    private final PassengerRepository repo;
    private final PnrRepository pnrRepo;

    public PassengerService(PassengerRepository repo, PnrRepository pnrRepo) {
        this.repo = repo;
        this.pnrRepo = pnrRepo;
    }

    // ✅ ADD
    public PnrPassenger add(String code, PassengerDTO dto) {
        Pnr pnr = pnrRepo.findByPnrCode(code).orElseThrow();

        PnrPassenger p = new PnrPassenger();
        p.setPassengerId(dto.getPassengerId());
        p.setPassengerType(dto.getPassengerType());
        p.setPnr(pnr);

        return repo.save(p);
    }

    // ✅ GET ALL
    public List<PnrPassenger> get(String code) {
        Pnr pnr = pnrRepo.findByPnrCode(code).orElseThrow();
        return repo.findByPnrId(pnr.getId());
    }

    // ✅ GET ONE
    public PnrPassenger getOne(Long id) {
        return repo.findById(id).orElseThrow();
    }

    // ✅ UPDATE
    public PnrPassenger update(Long id, PassengerDTO dto) {
        PnrPassenger p = getOne(id);
        p.setPassengerType(dto.getPassengerType());
        return repo.save(p);
    }

    // ✅ DELETE
    public void delete(Long id) {
        repo.deleteById(id);
    }
}