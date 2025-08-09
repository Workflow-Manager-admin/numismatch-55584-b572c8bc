#!/bin/bash
cd /home/kavia/workspace/code-generation/numismatch-55584-b572c8bc/numismatic_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

