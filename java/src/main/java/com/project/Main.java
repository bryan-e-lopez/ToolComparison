package com.project;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.context.annotation.Bean;
import org.springframework.web.bind.annotation.*;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

@RestController
@SpringBootApplication
public class Main {
	private int fibonacciCalc(int number) {
		if (number <= 1) return number;
		return fibonacciCalc(number - 1) + fibonacciCalc(number - 2);
	}

	@RequestMapping("/")
	String home() {
		return "Hello Java!";
	}

	@GetMapping("/concurrency/{number}")
	public String concurrency(@PathVariable("number") int number) {
		long programStart = System.currentTimeMillis();

        // Create a list to hold the futures (results of asynchronous tasks)
        List<Future<?>> futures = new ArrayList<>();

        // Create a fixed thread pool with 5 threads
        ExecutorService executorService = Executors.newFixedThreadPool(5);

        // Submit 100 tasks to run concurrently
        for (int i = 1; i <= number; i++) {
            int threadNumber = i;
            Future<?> future = executorService.submit(() -> {
                // Start the timer for this thread
                long threadStart = System.currentTimeMillis();

                // Simulate some work by sleeping for a short duration
                System.out.println("Thread " + threadNumber + " is starting its work.");
                try {
                    Thread.sleep(500);
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                }
                System.out.println("Thread " + threadNumber + " has finished its work.");

                // Calculate the elapsed time for this thread
                long threadDuration = System.currentTimeMillis() - threadStart;
                System.out.println("Thread " + threadNumber + " took " + threadDuration + " ms to complete.");
            });

            // Add the future to the list
            futures.add(future);
        }

        // Wait for all threads to finish
        try {
            for (Future<?> future : futures) {
                future.get();
            }

        }
        catch(Exception e){
            System.out.println("Array index is out of bounds!");
        }

        // Shut down the executor service
        executorService.shutdown();

        // Calculate the total elapsed time for the program
        long programDuration = System.currentTimeMillis() - programStart;
        System.out.println("All threads have finished execution.");
        System.out.println("Total execution time: " + programDuration + " ms");
        // Convert the total duration to seconds as a floating-point number
        double programDurationSeconds = programDuration / 1000.0;

        // Return the formatted string
        return String.format("%.6f s", programDurationSeconds);
	}

    @GetMapping("/fibonacci/{number}")
    public String fibonacci(@PathVariable("number") int number) {
        long startTime = System.currentTimeMillis();  // Start measuring time
        int result = fibonacciCalc(number);  // Calculate the Fibonacci value
        long duration = System.currentTimeMillis() - startTime;  // Compute elapsed time
    
        // Convert the duration to seconds as a floating-point number
        double timeInSeconds = duration / 1000.0;  // Convert to seconds as double
    
        // Return the formatted string
        return String.format("Fibonacci(%d) = Answer -> %d\nTime taken -> %.6f s", number, result, timeInSeconds);
    }
    


	public static void main(String[] args) {
		SpringApplication.run(Main.class, args);
	}
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**") // Allow CORS on all endpoints
                        .allowedOriginPatterns("*") // Allow all origins (note: does not allow credentials)
                        .allowedMethods("*") // Allow all HTTP methods
                        .allowedHeaders("*") // Allow all headers
                        .allowCredentials(true) // Allow credentials (cookies, authorization headers, etc.)
                        .maxAge(3600); // Cache preflight requests for 1 hour
            }
        };
    }
    
}
