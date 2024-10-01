    
use axum::{
    extract::Path,
    // response::{IntoResponse, Response},
    routing::{get},
    Router,
};
use tower_http::cors::{Any, CorsLayer};


// use serde::Serialize;
use std::thread;
use std::time::{Duration, Instant};

// Handler for /users
fn concurrency(n: u64) -> String {

    // Start the timer for the entire program
    let program_start = Instant::now();

    // Create a vector to hold the thread handles
    let mut handles = vec![];
    
    println!("Spawning {} threads for this job.", n);
    // Spawn n threads that run concurrently
    for i in 1..=n {
        let handle = thread::spawn(move || {
            // Start the timer for this thread
            let thread_start = Instant::now();

            // Simulate some work by sleeping for a short duration
            println!("Thread {} is starting its work.", i);
            thread::sleep(Duration::from_millis(500));
            println!("Thread {} has finished its work.", i);

            // Calculate the elapsed time for this thread
            let thread_duration = thread_start.elapsed();
            println!("Thread {} took {:?} to complete.", i, thread_duration);
        });

        // Push the thread handle into the vector
        handles.push(handle);
    }

    //1 Wait for all threads to finish
    for handle in handles {
        handle.join().unwrap();
    }

    // Calculate the total elapsed time for the program
    let program_duration = program_start.elapsed();
    println!("All threads have finished execution.");
    println!("Total execution time: {:?}", program_duration);
    
    let formatted_duration = format_duration(program_duration);

    return formatted_duration;
}


// Fibonacci function
fn fibonacci(n: u64) -> u64 {
    match n {
        0 => 0,
        1 => 1,
        _ => fibonacci(n - 1) + fibonacci(n - 2),
    }
}

// HELPERS:: Handler for the /fibonacci/:number route
async fn fibonacci_handler(Path(number): Path<u64>) -> String {
    let start_time = Instant::now();  // Start measuring time
    let result = fibonacci(number);
    let duration = start_time.elapsed();  // Compute elapsed time

    // Convert the duration to seconds as a floating-point number
    let time_in_seconds = duration.as_secs_f64();  // Convert to seconds as f64

    format!(
        "Fibonacci({}) = Answer -> {}\nTime taken -> {:.6} s.s",
        number, result, time_in_seconds
    )
}

fn format_duration(duration: Duration) -> String {
    let secs = duration.as_secs();
    let nanos = duration.subsec_nanos();
    format!("{}.{}s", secs, nanos)
}

async fn concurrency_handler(Path(threads): Path<u64>) -> String  {
    let time_to_finish = concurrency(threads);
    // format!("Time to finishi = {}", time_to_finish);

    // add here time to finish that way what is returned is the time that it took to run the threads s
    format!("{}.s", time_to_finish)
    
}

#[tokio::main]
async fn main() {
    // Define the CORS layer
    let cors = CorsLayer::new()
        .allow_origin(Any) // Allow requests from any origin
        .allow_methods(Any) // Allow any HTTP method
        .allow_headers(Any); // Allow any header

    // routes for the API 
    let app = Router::new()
    .route("/", get(|| async { "Hello Rust!" }))
    .route("/fibonacci/:number", get(fibonacci_handler))
    // .route("/concurrency", get(concurrency))
    .route("/concurrency/:threads", get(concurrency_handler))
    .layer(cors);

    println!("Running on http://localhost:7000");
    axum::Server::bind(&"0.0.0.0:7000".parse().unwrap())
        .serve(app.into_make_service())
        .await
        .unwrap();
}