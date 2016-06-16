angular.module("iterativeSearch")
    .service("SearchService", function () {
    	var self = this;

    	self.ARCHIVED_PROJECTS_JSON = "archived";
        self.ABSTRACT_JSON = "Abstract";
        self.CONTENT_JSON = "Content";
        self.VERDICT_JSON = "Verdict";
        self.FLAGGED_JSON = "Flagged";
        self.SEARCH_TERMS_JSON = "SearchTerms";
        self.SEARCH_TERMS_STR_JSON = "SearchTermsStr";
        
        //Notes
        self.CONTENTS_JSON = "Contents";
        self.SUBJECT_JSON = "Subject";
        self.AUTHOR_JSON = "Author";
        self.CREATED_JSON = "Created";
        self.NOTENAME_JSON = "NoteName";
        self.NOTES_JSON = "Notes";

        self.NOTE_JSON = "Note";
        self.LASTOPENED_JSON = "LastOpened";
        self.PROJECT_ID_JSON = "ProjectID";
		self.ID_JSON = "ID";
		self.PROJECT_JSON = "Project";
		self.PROJECT_NAME_JSON = "ProjectName";

        //Projects
        self.MYPROJECTS_JSON = "MyProjects";
        
        self.SEARCH_TYPE_VERDICTS = 1;
        self.SEARCH_TYPE_NOTES = 2;
        self.SEARCH_TYPE_FLAGGED = 3;

    	return {

		    tokenizeStr: function(searchStr) {

		        //Make a single space between words.
		        searchStr = searchStr.replace(","," ");
		        searchStr = searchStr.replace(/\s+/g, " ");
		        searchStr.trim();
		        
		        var tokens = searchStr.split(" ");
		        return tokens;
		    },

		    isStrInTokens: function(searchStr, tokens) {
		    	if(!tokens) {
		    		return false;
		    	}

		    	searchStr = this.cleanStr(searchStr);

		        for(var i = 0; i < tokens.length; i++) {
		            var token = this.cleanStr(tokens[i]);
		            if(searchStr == token) {
		                return true;
		            }
		        }

		        return false;
		    },

		    createResultObj: function (verdict, searchArchived) {
		        var result = verdict;
		        result[self.ARCHIVED_PROJECTS_JSON] = searchArchived;

		        var searchTerms = verdict[self.SEARCH_TERMS_JSON];
		        var searchTermsStr;
		        if(searchTerms) {
		        	searchTermsStr = searchTerms.join();
		        } else {
		        	searchTermsStr = "";
		        }

		        result[self.SEARCH_TERMS_STR_JSON] = searchTermsStr;
		        
		        return result;
		    },

		    createNoteResultsObj: function (note, verdict, searchArchived, projects, results) {
		        var result = note;

		        result[self.ARCHIVED_PROJECTS_JSON] = searchArchived;

		        if(projects && projects.length > 0) {
		        	var proj = this.findProjectFromNote(projects, note);
		        	var projName = proj[self.PROJECT_JSON];	

		        	result[self.PROJECT_JSON] = proj;
		        	result[self.PROJECT_NAME_JSON] = projName;        
		        } else {
		        	result[self.PROJECT_JSON] = false;
		        	result[self.PROJECT_NAME_JSON] = "Verdict";
		        }	

				if(verdict) {
		        	result[self.VERDICT_JSON] = verdict;
		        } else {
		        	result[self.VERDICT_JSON] = false;
		        }

		        var lastOpened = note[self.LASTOPENED_JSON];
		        result[self.LASTOPENED_JSON] = lastOpened;

		        results.push(result);		        

		        return results;
		    },

		    cleanStr: function(str){
		    	if(str){
		    		str = str.toLowerCase();
		    	}

		    	return str;
		    },

		    searchNoteObj: function(verdict, searchStr, results, searchArchived, note, projects){
		    	var tokens = this.tokenizeStr(searchStr);
		    	var numTokens = tokens.length;
		    	if(numTokens == 0) {
		    		return results;
		    	}

		    	var author = note[self.AUTHOR_JSON];
		    	var createdAt = note[self.CREATED_JSON];
		    	var contents = note[self.CONTENTS_JSON];
		    	var noteName = note[self.NOTENAME_JSON];

		    	var noteNameTokens = this.tokenizeStr(noteName);
		    	var authorTokens = this.tokenizeStr(author);
		    	var contentsTokens = this.tokenizeStr(contents);
		    	
		    	var numMatches = 0;

		    	//Need to ensure all the tokens are present.
		        for (var tokenIndex = 0; tokenIndex < numTokens; tokenIndex++){
		            var token = tokens[tokenIndex];
		        
			    	//Search the noteName
					
		            var match = this.isStrInTokens(token, noteNameTokens);
					if(match) {
						numMatches++;
						continue;
					}

		            var match = this.isStrInTokens(token, authorTokens);
					if(match) {
						numMatches++;
						continue;
					}

		            var match = this.isStrInTokens(token, contentsTokens);
					if(match) {
						numMatches++;
						continue;
					}
				}
				
				if(numMatches == numTokens) {
					return this.createNoteResultsObj(note, verdict, searchArchived, projects, results);
				}
				
				return results;
		    },

		    searchVerdictObjNotes: function(verdict, searchStr, results, searchArchived) {
		    	var notes = verdict[self.NOTES_JSON];
		    	if(!notes) {
		    		return false;
		    	}

		    	var results = [];

		    	for (var i = 0; i < notes.length; i++){
		    		var note = notes[i];
		    		results = this.searchNoteObj(verdict, searchStr, results, searchArchived, note, false);
			    }
			    return results;
		    },

		    searchVerdictObj: function(verdict, searchStr){
		    	var tokens = this.tokenizeStr(searchStr);
		    	var numTokens = tokens.length;
		    	if(numTokens == 0) {
		    		return false;
		    	}

 		    	var abstract = verdict[self.ABSTRACT_JSON];
				var content = verdict[self.CONTENT_JSON];

				var abstractTokens = this.tokenizeStr(abstract);
				var contentTokens = this.tokenizeStr(content);

				var numMatches = 0;

				//Need to ensure all the tokens are present.
		        for (var tokenIndex = 0; tokenIndex < numTokens; tokenIndex++){
		            var token = tokens[tokenIndex];
				
	                var match = this.isStrInTokens(token, abstractTokens);
				    if(match) {
						numMatches++;
						continue;
					}  
				    
				    var match = this.isStrInTokens(token, contentTokens);
				    if(match) {
						numMatches++;
						continue;
					}	
				}

				return (numMatches == numTokens);
		    },

		    findProjectFromNote: function(projects, myProjectNote) {
		    	var projectId = myProjectNote[self.PROJECT_ID_JSON];

		        for (var i = 0; i < projects.length; i++){
		        	var project = projects[i];
		        	var projId = project[self.ID_JSON];

		        	if(projId == projectId) {
		        		return project;
		        	}
		        }

		        return false;
		    },

		    searchMyProjectsNotes: function(myProjects, myProjectsNotes, searchStr, searchArchived) {
		    	var results = [];

	            //And every note
	            for (var i = 0; i < myProjectsNotes.length; i++){
	            	var myProjectNote = myProjectsNotes[i];
	            	results = this.searchNoteObj(false, searchStr, results, searchArchived, myProjectNote, myProjects);
	            }
		        	 
		        return results; 
		    },    

		    doSearchVerdicts: function(verdicts, searchStr, results, searchArchived, searchType) {
		        var idsAdded = {};
		        
	            for (var i = 0; i < verdicts.length; i++){
	                
	                var verdict = verdicts[i];
	                var verdictId = String(verdict.id);
	                //If we already added this verdict from previous token just skip it
	                if(idsAdded[verdictId]) {
	                	continue;
	                }

	                if(searchType == self.SEARCH_TYPE_NOTES) {
	                	var resultsSizeBefore = results.length;
	                	results = this.searchVerdictObjNotes(verdict, searchStr, results, searchArchived);
	                	var resultsSizeAfter = results.length;  
	                	if(resultsSizeBefore != resultsSizeAfter) {
	                		idsAdded[verdictId] = true;
	                	}            	
	                } else if(searchType == self.SEARCH_TYPE_VERDICTS) {
	                	var match = this.searchVerdictObj(verdict, searchStr);
	                	if(match) {
			    			var result = this.createResultObj(verdict, searchArchived);
			        		results.push(result);
			        		idsAdded[verdictId] = true;
			        		continue;
			    		}	
	                } 	                	                
	            }

		        return results;
		    },

		    searchVerdictFlagged: function(verdicts, searchArchived) {
				//A note may exist on the verdict or on the project
				var results = [];
				for (var i = 0; i < verdicts.length; i++){
		            var verdict = verdicts[i];
		            var flagged = verdict[self.FLAGGED_JSON];
		            
		            if(flagged) {
		            	var resultVerdict = this.createResultObj(verdict, searchArchived);
		            	results.push(resultVerdict);
		            }   
		        }	
				return results;
			},

			searchVerdictNotes: function(verdicts, searchStr, searchArchived) {
				//A note may exist on the verdict or on the project
				var results = [];
				results = this.doSearchVerdicts(verdicts, searchStr, results, searchArchived, self.SEARCH_TYPE_NOTES);
				return results;
			},

		    searchVerdicts: function(verdicts, searchStr, searchArchived) {
		    	var results = [];
				results = this.doSearchVerdicts(verdicts, searchStr, results, searchArchived, self.SEARCH_TYPE_VERDICTS);
				return results;
		    }
		}
});   