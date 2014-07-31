#!/bin/bash

# Constants
FGREP="fgrep"

# Check if ag exists
which ag
if [ $? = 0 ]; then
   FGREP="ag"
fi

# Script args
WORKSPACE=$1
PORT=$2

# Get plausible entry point
entry_point=$(${FGREP} "if not package.loaded['main'] then" -R ${WORKSPACE} | tr ':' '\n' | grep ".lua" | head -n 1)

# No entry point found
# default to main.lua
if [ -z "$entry_point" ]; then
    entry_point="./main.lua"
fi

if [ -f ${entry_point} ]; then
    exec lua ${entry_point}
else
    # Exit
    exit 1
fi
