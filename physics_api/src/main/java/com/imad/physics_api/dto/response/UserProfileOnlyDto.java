// dto/response/UserProfileOnlyDto.java (NEW - for profile data only)
package com.imad.physics_api.dto.response;

import com.imad.physics_api.model.enums.AcademicLevel;
import com.imad.physics_api.model.enums.Branch;

import java.time.LocalDate;

public class UserProfileOnlyDto {

    private String schoolName;
    private String city;
    private AcademicLevel academicLevel;
    private Branch branch;
    private String bio;
    private String phoneNumber;
    private LocalDate birthDate;

    // Constructors
    public UserProfileOnlyDto() {}

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
