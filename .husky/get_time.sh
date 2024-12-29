declare time_to_run

get_time() {
	start_time=$(($(date +%s) * 1000 + $(date +%N | sed 's/^0*//') / 1000000))

	# Execute the command passed to the function
	"$@" 

	end_time=$(($(date +%s) * 1000 + $(date +%N | sed 's/^0*//') / 1000000))
	elapsed_time=$((end_time - start_time))
	integer_sec=$((elapsed_time / 1000))
	milliseconds=$((elapsed_time % 1000))
	
	time_to_run=$(printf "%d.%03d s" "$integer_sec" "$milliseconds")
}