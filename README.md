Jira-Genie
=========

A custom function for dynamically pulling Jira data into a spreadsheet.
It allows you to reference properties on a ticket like this with a function like this...

```
=fetchJiraData("PROJECT-123","summary",{refreshValue})
```

More on the refresh value later...



### How do I add this to my spreadsheet?

1. Create or open your Google Spreadsheet
2. Tools > Script Editor
3. Select "Blank Project"
4. Clear out any pre-populated code and insert the code from FetchJiraData.gs
5. Update "_{Jira URL}_" with the proper value and save!

*Note: The first time a user opens the document, they will be prompted to enter their Jira credentials.*


### How do I use this formula?

1. Enter the following formula into a cell: `=fetchJiraData("PROJECT-123","summary",{refreshValue})`
  * "{refreshValue}" is any value.
      * I typically create a specific cell for this purpose and reference it every time I use the formula.
      * Any time you change this value it will force the data to re-pull, which is necessary if the formula errors out or if the data in Jira changed.

  * When referencing a sub-property, separate the parent and child with "///".
      * Example: if we wanted the priority name, rather than the summary (as above), we would use "priority///name"

2. Profit

*Note: Available properties can be found in JiraProperties.json*
