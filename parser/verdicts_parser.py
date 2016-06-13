import os
import sys
import csv
import json
import openpyxl as px

INPUT_FILE = "./verdicts.xlsx"
OUTPUT_FILE = "./verdicts.json"

YEAR_INDEX = 0
MONTH_INDEX = 1
STATE_INDEX = 2
ABSTRACT_INDEX = 3
CONTENT_INDEX = 4
VERDICT_AMOUNT = 5

SHEET_NAME = "Medical"

#Delete output file if it exists
try:
    os.remove(OUTPUT_FILE)
except OSError:
    pass

#These are the constants used to create the JSON objects.
VERDICTS_JSON = "Verdicts"
ID_JSON = "id"
NOTE_ID_JSON = "ID"
DATE_JSON = "Date"
LAST_OPENED_JSON = "LastOpened"
STATE_JSON = "State"
ABSTRACT_JSON = "Abstract"
AMOUNT_JSON = "Amount"
FLAGGED_JSON = "Flagged"
NOTES_JSON = "Notes"
AUTHOR_JSON = "Author"
CONTENT_JSON = "Content"
CONTENTS_JSON = "Contents"
SUBJECT_JSON = "Subject"
AUTHOR_JSON = "Author"
NOTENAME_JSON = "NoteName"
CREATED_JSON = "Created"
SEARCH_TERMS_JSON = "SearchTerms"

verdicts = []

W = px.load_workbook(INPUT_FILE, use_iterators = True)
p = W.get_sheet_by_name(name = SHEET_NAME)

a=[]

id = 0

def create_notes_obj():
    """
    note1 = create_note_obj(1)
    note2 = create_note_obj(2)
    notes = []
    notes.append(note1);
    notes.append(note2);
    """
    notes = []

    return notes

def create_note_obj(note_id):
    note = {}

    note[NOTE_ID_JSON] = note_id;
    note[AUTHOR_JSON] = "Tony Brown";
    note[NOTENAME_JSON] = "Quick Note";
    #dd/mm/yy
    note[LAST_OPENED_JSON] = "";
    note[CREATED_JSON] = "01/02/13";
    note[CONTENTS_JSON] = "This day was like no other day in the Healthcare Segment.";

    return note

for row in p.iter_rows():
    verdict = {}
    notes = create_notes_obj()

    i = 0
    id = id + 1   

    for cell in row:
        line = cell.value

        if i == YEAR_INDEX:
            year = line
        elif i == MONTH_INDEX:
            month = line
        elif i == STATE_INDEX:
            state = line
        elif i == ABSTRACT_INDEX:
            abstract = line
        elif i == CONTENT_INDEX:
            content = line
        elif i == VERDICT_AMOUNT:
            amount = line

            if not amount or amount == "":
                amount = 0

            if len(str(month)) < 2:
                month = "0" + str(month)
            default_day = "12"
            
            #mm/dd/yyyy
            date = str(month) + "/" + default_day + "/" + str(year)
            #2014-03-12T13:37:27+00:00
            #date = str(year) + "-" + str(month) + "-" + default_day + "T00:00:00+00:00"

            flagged_default_value = False
            verdict[ID_JSON] = id
            verdict[LAST_OPENED_JSON] = "";
            verdict[DATE_JSON] = date
            verdict[STATE_JSON] = state
            verdict[ABSTRACT_JSON] = abstract
            verdict[AMOUNT_JSON] = amount
            verdict[CONTENT_JSON] = content
            verdict[FLAGGED_JSON] = flagged_default_value
            verdict[NOTES_JSON] = notes
            verdict[SEARCH_TERMS_JSON] = []

            verdicts.append(verdict)

            content = ""
            year = ""
            month = ""
            state = ""
            abstract = ""
            amount = ""

            i = 0
            continue

        i = i + 1

verdict_obj = {}
verdict_obj[VERDICTS_JSON] = verdicts
verdict_obj_str = json.dumps(verdict_obj)

with open(OUTPUT_FILE, 'w') as fh_w:
    fh_w.write(verdict_obj_str)
