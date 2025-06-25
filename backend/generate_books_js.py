from pydrive.auth import GoogleAuth
from pydrive.drive import GoogleDrive
import os
import json

gauth = GoogleAuth()
gauth.CommandLineAuth()
drive = GoogleDrive(gauth)

def recursive_scan(folder_id, region, path_prefix=""):
    file_list = drive.ListFile({'q': f"'{folder_id}' in parents and trashed=false"}).GetList()
    books = []

    for file in file_list:
        if file['mimeType'] == 'application/vnd.google-apps.folder':
            new_path = os.path.join(path_prefix, file['title'])
            books += recursive_scan(file['id'], region, new_path)
        elif file['mimeType'] == 'application/pdf':
            books.append({
                "title": file['title'].replace(".pdf", "").replace("_", " ").title(),
                "path": path_prefix,
                "region": region,
                "drive_url": f"https://drive.google.com/file/d/{file['id']}/view?usp=sharing"
            })
    return books

# Google Drive IDs
mainland_folder_id = '1INxk5402iepR7l_y2pbZt292z4Fg3gX6'  # 内地数学教材
hongkong_folder_id = '1fLbgT17jKz3WFB8SkuHxQBpiocrEcupU'  # 香港教材

# 获取两个地区的书籍
mainland_books = recursive_scan(mainland_folder_id, "mainland")
hongkong_books = recursive_scan(hongkong_folder_id, "hongkong")

# 合并所有书籍
all_books = mainland_books + hongkong_books

# 写入文件，使用json确保正确的格式化
with open('books.js', 'w', encoding='utf-8') as f:
    f.write("const books = " + json.dumps(all_books, ensure_ascii=False, indent=2) + ";")
