// dto/request/UpdateProfileRequest.java
package com.imad.physics_api.dto.request;

import com.imad.physics_api.model.enums.AcademicLevel;
import com.imad.physics_api.model.enums.Branch;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public class UpdateProfileRequest {

    @NotBlank(message = "First name is required")
    @Size(max = 50, message = "First name must not exceed 50 characters")
    private String firstName;

    @NotBlank(message = "Last name is required")
    @Size(max = 50, message = "Last name must not exceed 50 characters")
    private String lastName;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @Size(max = 100, message = "School name must not exceed 100 characters")
    private String schoolName;

    @Size(max = 50, message = "City must not exceed 50 characters")
    private String city;

    private AcademicLevel academicLevel;

    private Branch branch;

    @Size(max = 1000, message = "Bio must not exceed 1000 characters")
    private String bio;

    @Size(max = 20, message = "Phone number must not exceed 20 characters")
    private String phoneNumber;

    private LocalDate birthDate;

    // Constructors
    public UpdateProfileRequest() {}

    // Getters and Setters
    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getSchoolName() { return schoolName; }
    public void setSchoolName(String schoolName) { this.schoolName = schoolName; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public AcademicLevel getAcademicLevel() { return academicLevel; }
    public void setAcademicLevel(AcademicLevel academicLevel) { this.academicLevel = academicLevel; }

    public Branch getBranch() { return branch; }
    public void setBranch(Branch branch) { this.branch = branch; }

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public LocalDate getBirthDate() { return birthDate; }
    public void setBirthDate(LocalDate birthDate) { this.birthDate = birthDate; }
}