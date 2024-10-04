# Functions
 - ### Ls
   - Syntax:
      ```
      file ls path: string 

      file:ls(path: string)
      ```
   - Usage:
generates a list of files and folders in a path
   - Other:
     - Returns a value
 - ### Get
   - Syntax:
      ```
      file get path: string 

      file:get(path: string)
      ```
   - Usage:
gets a file from a path
   - Other:
     - Returns a value
 - ### Create
   - Syntax:
      ```
      file create path: string content: string 

      file:create(path: string, content: string)
      ```
   - Usage:
creates a file at a path with the content
 - ### Delete
   - Syntax:
      ```
      file delete path: string 

      file:delete(path: string)
      ```
   - Usage:
deletes a file
 - ### Exists
   - Syntax:
      ```
      file exists path: string 

      file:exists(path: string)
      ```
   - Usage:
checks if a file exists
   - Other:
     - Returns a value
 - ### Write
   - Syntax:
      ```
      file write path: string content: string 

      file:write(path: string, content: string)
      ```
   - Usage:
writes to a file