#!/usr/bin/env bash
#   Use this script to test if a given TCP host/port are available

# Exit immediately if a command exits with a non-zero status
set -e

# A function to display the usage message
usage() {
    cat << USAGE >&2
Usage:
    $0 host:port [-s] [-t timeout] [-- command args]
    -h HOST | --host=HOST       Host or IP under test
    -p PORT | --port=PORT       TCP port under test
                                Alternatively, you specify the host and port as host:port
    -s | --strict               Only execute subcommand if the test succeeds
    -q | --quiet                Don't output any status messages
    -t TIMEOUT | --timeout=TIMEOUT
                                Timeout in seconds, zero for no timeout
    -- COMMAND ARGS             Execute command with args after the test finishes
USAGE
    exit 1
}

# Initialize variables
wait_for() {
    for i in `seq $TIMEOUT` ; do
        nc -z "$HOST" "$PORT" >/dev/null 2>&1
        result=$?
        if [ $result -eq 0 ] ; then
            if [ $# -gt 0 ] ; then
                exec "$@"
            fi
            exit 0
        fi
        sleep 1
    done
    echo "Operation timed out" >&2
    exit 1
}

# Parse command line arguments
while [ $# -gt 0 ]
do
    case "$1" in
        *:* )
        hostport=(${1//:/ })
        HOST=${hostport[0]}
        PORT=${hostport[1]}
        shift 1
        ;;
        -h)
        HOST="$2"
        if [ "$HOST" == "" ] ; then usage; fi
        shift 2
        ;;
        --host=*)
        HOST="${1#*=}"
        shift 1
        ;;
        -p)
        PORT="$2"
        if [ "$PORT" == "" ] ; then usage; fi
        shift 2
        ;;
        --port=*)
        PORT="${1#*=}"
        shift 1
        ;;
        -t)
        TIMEOUT="$2"
        if [ "$TIMEOUT" == "" ] ; then usage; fi
        shift 2
        ;;
        --timeout=*)
        TIMEOUT="${1#*=}"
        shift 1
        ;;
        -s | --strict)
        STRICT=1
        shift 1
        ;;
        -q | --quiet)
        QUIET=1
        shift 1
        ;;
        --)
        shift
        break
        ;;
        --help)
        usage
        ;;
        *)
        echo "Unknown argument: $1" >&2
        usage
        ;;
    esac
done

if [ "$HOST" == "" ] || [ "$PORT" == "" ]; then
    echo "Error: you need to provide a host and port to test." >&2
    usage
fi

TIMEOUT=${TIMEOUT:-15}

# If command line arguments remain, execute them with arguments passed after host:port is ready
wait_for "$@"
