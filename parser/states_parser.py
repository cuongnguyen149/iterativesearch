import os
import sys
import csv
import json
import openpyxl as px

INPUT_FILE = "./states.xlsx"
OUTPUT_FILE = "./states.json"

STATE_INDEX = 0
ABBREVIATION_INDEX = 1

SHEET_NAME = "states"

#Delete output file if it exists
try:
    os.remove(OUTPUT_FILE)
except OSError:
    pass

#These are the constants used to create the JSON objects.
STATE_JSON = "State"
ABBREVIATION_JSON = "Abbrev"
STATES_JSON = "States"

states = []

W = px.load_workbook(INPUT_FILE, use_iterators = True)
p = W.get_sheet_by_name(name = SHEET_NAME)

for row in p.iter_rows():
    state = {}
    i = 0

    for cell in row:
        line = cell.value
        if i == STATE_INDEX:
            state_name = line
        elif i == ABBREVIATION_INDEX:
            abbrev = line

            state[STATE_JSON] = state_name
            state[ABBREVIATION_JSON] = abbrev

            states.append(state)

            state_name = ""
            abbrev = ""

            i = 0
            continue

        i = i + 1

state_obj = {}
state_obj[STATES_JSON] = states
state_obj_str = json.dumps(state_obj)

with open(OUTPUT_FILE, 'w') as fh_w:
    fh_w.write(state_obj_str)
