package com.airline.flight_service.dto;

public class GateAssignmentRequest {

    private Long gateId;
    private String terminal;

    public Long getGateId() { return gateId; }
    public void setGateId(Long gateId) { this.gateId = gateId; }

    public String getTerminal() { return terminal; }
    public void setTerminal(String terminal) { this.terminal = terminal; }
}