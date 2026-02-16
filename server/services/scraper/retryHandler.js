export const withRetry=async(fn,retries=3,delay=2000)=>{
    for(let attempt=1; attempt<=retries;attempt++){
        try {
            return await fn();
        } catch (error) {
            if(attempt==retries) throw error;
            console.warn(`Retry ${attempt} failed. Retrying in ${delay} ms`);
            await new Promise(res=> setTimeout(res,delay));
            delay*=2;
        }
    }
}