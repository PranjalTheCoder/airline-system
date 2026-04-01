package com.airline.reservation_service.dto.response;

public class PassengerResponseDTO {

    private String id;
    private String type;
    private String title;
    private String firstName;
    private String lastName;

    private String dateOfBirth;
    private String gender;
    private String nationality;

    private String passportNumber;
    private String passportExpiry;

    private String mealPreference;

    private String selectedSeatNumber;

    // Default constructor
    public PassengerResponseDTO() {
    }

    // Parameterized constructor
    public PassengerResponseDTO(String id, String type, String title, String firstName, String lastName,
                                String dateOfBirth, String gender, String nationality,
                                String passportNumber, String passportExpiry,
                                String mealPreference, String selectedSeatNumber) {
        this.id = id;
        this.type = type;
        this.title = title;
        this.firstName = firstName;
        this.lastName = lastName;
        this.dateOfBirth = dateOfBirth;
        this.gender = gender;
        this.nationality = nationality;
        this.passportNumber = passportNumber;
        this.passportExpiry = passportExpiry;
        this.mealPreference = mealPreference;
        this.selectedSeatNumber = selectedSeatNumber;
    }

    // Getter and Setter for id
    public String getId() {
        return id;
    }
    public void setId(String id) {
        this.id = id;
    }

    // Getter and Setter for type
    public String getType() {
        return type;
    }
    public void setType(String type) {
        this.type = type;
    }

    // Getter and Setter for title
    public String getTitle() {
        return title;
    }
    public void setTitle(String title) {
        this.title = title;
    }

    // Getter and Setter for firstName
    public String getFirstName() {
        return firstName;
    }
    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    // Getter and Setter for lastName
    public String getLastName() {
        return lastName;
    }
    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    // Getter and Setter for dateOfBirth
    public String getDateOfBirth() {
        return dateOfBirth;
    }
    public void setDateOfBirth(String dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    // Getter and Setter for gender
    public String getGender() {
        return gender;
    }
    public void setGender(String gender) {
        this.gender = gender;
    }

    // Getter and Setter for nationality
    public String getNationality() {
        return nationality;
    }
    public void setNationality(String nationality) {
        this.nationality = nationality;
    }

    // Getter and Setter for passportNumber
    public String getPassportNumber() {
        return passportNumber;
    }
    public void setPassportNumber(String passportNumber) {
        this.passportNumber = passportNumber;
    }

    // Getter and Setter for passportExpiry
    public String getPassportExpiry() {
        return passportExpiry;
    }
    public void setPassportExpiry(String passportExpiry) {
        this.passportExpiry = passportExpiry;
    }

    // Getter and Setter for mealPreference
    public String getMealPreference() {
        return mealPreference;
    }
    public void setMealPreference(String mealPreference) {
        this.mealPreference = mealPreference;
    }

    // Getter and Setter for selectedSeatNumber
    public String getSelectedSeatNumber() {
        return selectedSeatNumber;
    }
    public void setSelectedSeatNumber(String selectedSeatNumber) {
        this.selectedSeatNumber = selectedSeatNumber;
    }
}
