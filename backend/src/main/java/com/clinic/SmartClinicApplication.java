package com.clinic;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class SmartClinicApplication {

	public static void main(String[] args) {
		System.setProperty("spring.classformat.ignore", "true");
		SpringApplication.run(SmartClinicApplication.class, args);
	}

}
