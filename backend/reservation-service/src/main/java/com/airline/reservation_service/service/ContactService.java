package com.airline.reservation_service.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.airline.reservation_service.dto.ContactDTO;
import com.airline.reservation_service.entity.Pnr;
import com.airline.reservation_service.entity.PnrContact;
import com.airline.reservation_service.repository.ContactRepository;
import com.airline.reservation_service.repository.PnrRepository;

@Service
public class ContactService {

    private final ContactRepository repo;
    private final PnrRepository pnrRepo;

    public ContactService(ContactRepository repo, PnrRepository pnrRepo) {
        this.repo = repo;
        this.pnrRepo = pnrRepo;
    }

    public PnrContact add(String code, ContactDTO dto){
        Pnr pnr = pnrRepo.findByPnrCode(code).orElseThrow();

        PnrContact c = new PnrContact();
        c.setEmail(dto.getEmail());
        c.setPhone(dto.getPhone());
        c.setPnr(pnr);

        return repo.save(c);
    }

    public List<PnrContact> get(String code){
        Pnr pnr = pnrRepo.findByPnrCode(code).orElseThrow();
        return repo.findByPnrId(pnr.getId());
    }

    public PnrContact update(Long id, ContactDTO dto){
        PnrContact c = repo.findById(id).orElseThrow();
        c.setEmail(dto.getEmail());
        c.setPhone(dto.getPhone());
        return repo.save(c);
    }

    public void delete(Long id){
        repo.deleteById(id);
    }
}