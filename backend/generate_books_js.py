from pydrive2.auth import GoogleAuth
from pydrive2.drive import GoogleDrive
import os
import json

# --- Google Drive Authentication ---
# This section handles the authentication with Google Drive.
# It will prompt you to log in via the command line the first time.
gauth = GoogleAuth()
gauth.CommandLineAuth()
drive = GoogleDrive(gauth)

def recursive_scan(folder_id, path_prefix=""):
    """
    Recursively scans a Google Drive folder for PDF files.

    Args:
        folder_id (str): The ID of the Google Drive folder to start scanning from.
        path_prefix (str): The current path, used for recursive calls.

    Returns:
        list: A list of dictionaries, where each dictionary represents a book (PDF file).
    """
    # Get the list of files and folders in the current folder_id
    # The query looks for items whose parent is the current folder_id and are not in the trash.
    file_list = drive.ListFile({'q': f"'{folder_id}' in parents and trashed=false"}).GetList()
    books = []

    for file in file_list:
        # If the item is a folder, recurse into it
        if file['mimeType'] == 'application/vnd.google-apps.folder':
            # Construct the new path for the subfolder
            new_path = f"{path_prefix}/{file['title']}" if path_prefix else file['title']
            # Extend the books list with results from the recursive call
            books.extend(recursive_scan(file['id'], new_path))
        # If the item is a PDF file, process it
        elif file['mimeType'] == 'application/pdf':
            # Create the book object
            book_data = {
                # Clean up the title by removing the .pdf extension
                "title": file['title'].replace(".pdf", ""),
                # Use the constructed path prefix
                "path": path_prefix,
                # Create the shareable Google Drive URL
                "drive_url": f"https://drive.google.com/file/d/{file['id']}/view?usp=sharing"
            }
            # Add the book data to our list
            books.append(book_data)
    return books

# --- Main Script Execution ---

# Define the root Google Drive folder IDs for each region
mainland_folder_id = '1INxk5402iepR7l_y2pbZt292z4Fg3gX6'  # Folder name: 内地数学教材
hongkong_folder_id = '1fLbgT17jKz3WFB8SkuHxQBpiocrEcupU'  # Folder name: 香港教材

print("Fetching files for 'mainland' region...")
mainland_books = recursive_scan(mainland_folder_id)
print(f"Found {len(mainland_books)} books for 'mainland'.")

print("Fetching files for 'hongkong' region...")
hongkong_books = recursive_scan(hongkong_folder_id)
print(f"Found {len(hongkong_books)} books for 'hongkong'.")


# --- Structure the Data for the New Format ---
# Create the main 'regions' object that will be written to the JS file.
# This structure matches the new desired format.
regions_data = {
    "mainland": {
        "name": "内地小学数学教材",
        "books": mainland_books
    },
    "hongkong": {
        "name": "香港教材",
        "books": hongkong_books
    }
}

# --- Write the Data to books.js ---
# Write the structured data to the 'books.js' file.
# We use json.dumps for proper formatting and to handle special characters.
output_filename = 'books.js'
print(f"Writing data to {output_filename}...")
with open(output_filename, 'w', encoding='utf-8') as f:
    # Start the file with "const regions = "
    f.write("const regions = ")
    # Dump the python dictionary as a JSON string.
    # ensure_ascii=False is important for correctly writing Chinese characters.
    # indent=2 makes the file readable.
    f.write(json.dumps(regions_data, ensure_ascii=False, indent=2))
    # End the line with a semicolon
    f.write(";")

print("Script finished successfully.")
