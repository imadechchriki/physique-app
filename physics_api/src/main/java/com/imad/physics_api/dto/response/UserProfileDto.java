package com.imad.physics_api.dto.response;

import com.imad.physics_api.model.enums.AcademicLevel;
import com.imad.physics_api.model.enums.Branch;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDate;

@Schema(description = "User profile information")
public class UserProfileDto {

    @Schema(description = "School name")
    private String schoolName;

    @Schema(description = "City")
    private String city;

    @Schema(description = "Academic level")
    private AcademicLevel academicLevel;

    @Schema(description = "Academic branch")
    private Branch branch;

    @Schema(description = "Biography")
    private String bio;

    @Schema(description = "Phone number")
    private String phoneNumber;

    @Schema(description = "Birth date")
    private LocalDate birthDate;

    // Getters and Setters
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