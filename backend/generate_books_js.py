from pydrive.auth import GoogleAuth
from pydrive.drive import GoogleDrive
import os

gauth = GoogleAuth()
gauth.CommandLineAuth()
drive = GoogleDrive(gauth)

def recursive_scan(folder_id, path_prefix=""):
    file_list = drive.ListFile({'q': f"'{folder_id}' in parents and trashed=false"}).GetList()
    books = []

    for file in file_list:
        if file['mimeType'] == 'application/vnd.google-apps.folder':
            new_path = os.path.join(path_prefix, file['title'])
            books += recursive_scan(file['id'], new_path)
        elif file['mimeType'] == 'application/pdf':
            books.append({
                "title": file['title'].replace(".pdf", "").replace("_", " ").title(),
                "path": path_prefix,
                "drive_url": f"https://drive.google.com/file/d/{file['id']}/view?usp=sharing"
            })
    return books

# Google Drive ID
folder_id = '1INxk5402iepR7l_y2pbZt292z4Fg3gX6'
books = recursive_scan(folder_id)


with open('books.js', 'w') as f:
    f.write("const books = " + str(books).replace("'", '"') + ";")
