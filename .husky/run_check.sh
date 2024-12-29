
animation() {
	local message=$1
	local command_pid=$2

	# Animation loop
	local delay=0.4
	local dots=""

	while ps -p $command_pid > /dev/null; do
		for dots in "" "." ".." "..."; do
			echo -ne "\r\033[K$message$dots"  # Print the message with dots
			sleep $delay
		done
	done
}

# TODO: Print the time it took to run the check after it's done
run_check() {
	local message=$1  	# Task description (e.g., "Running TypeScript check")
	local command=$2  	# Command to run

	echo -n "🚀  $message..."

	# Run the command in the background
	eval "$command" > /dev/null 2>&1 &
	local command_pid=$!

	# Animation
	animation "🚀  $message" "$command_pid"

	wait $command_pid
	local exit_status=$?

	# Record end time in seconds
	local end_time=$(date +%s%3N)


	# Display result
	if [ $exit_status -eq 0 ]; then
		echo -e "\r\033[K✅  $message" 
	else
		echo -e "\r\033[K❌  $message"
		print_error "$command"
		
		exit 1
	fi
}

print_error() {
	local command=$1

	echo 
	echo "🔧 Run '$command' to view and resolve the issues."
	echo 
}