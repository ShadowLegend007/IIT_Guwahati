import requests
import json
import os
import time

# before run the python code checkout once product_data/read.txt file

# --- Configuration ---
output_folder = "product_data"
json_filename = "all_product_data.json"
start_page = 84
end_page = 85000 
# This is the "Simple Array" where all IDs will be stored in memory
simple_array = []

# EXCLUDED "image_url" and "selected_images" so JSON stays clean
keys_to_keep = [
    "_id", "_keywords", "categories", "categories_hierarchy", "countries", 
    "editors_tags", "food_groups_tags", "ingredients_analysis_tags", 
    "labels_hierarchy", "nutriments", "nutriscore", "nutriscore_data", 
    "nutriscore_grade", "nutriscore_score", "product_name", "product_name_en", 
    "product_type", "product_quantity", "product_quantity_unit", 
    "serving_quantity", "serving_quantity_unit", "url"
]

headers = {
    'User-Agent': 'MyFoodDataScraper/1.0 (contact@example.com)'
}

# --- Helper Functions ---

def ensure_folder_exists(folder):
    if not os.path.exists(folder):
        os.makedirs(folder)

def download_image(url, folder_path, filename):
    try:
        response = requests.get(url, headers=headers, timeout=10)
        if response.status_code == 200:
            file_path = os.path.join(folder_path, filename)
            with open(file_path, 'wb') as f:
                f.write(response.content)
            print(f"    [IMG] Saved: {filename}")
        else:
            print(f"    [IMG] Failed {filename}: Status {response.status_code}")
    except Exception as e:
        print(f"    [IMG] Error {filename}: {e}")

# --- Main Logic ---
def process_single_product(target_barcode):
    ensure_folder_exists(output_folder)
    print(f"Fetching data for product: {target_barcode}...")
    
    url = f"https://world.openfoodfacts.org/api/v2/product/{target_barcode}.json"
    
    try:
        # 1. API Request
        response = requests.get(url, headers=headers, timeout=15)
        if response.status_code != 200:
            print(f"Error fetching product. Status: {response.status_code}")
            return

        data = response.json()
        product = data.get('product')
        
        if not product:
            print("Product data is empty.")
            return

        # 2. Extract Data (Text only for JSON)
        extracted_data = {}
        for key in keys_to_keep:
            value = product.get(key)
            if value is None:
                extracted_data[key] = "NA"
            else:
                extracted_data[key] = value

        # 3. Save to JSON
        json_path = os.path.join(output_folder, json_filename)
        product_list = []

        if os.path.exists(json_path):
            try:
                with open(json_path, 'r', encoding='utf-8') as f:
                    content = json.load(f)
                    product_list = content if isinstance(content, list) else [content]
            except json.JSONDecodeError:
                product_list = []
        
        product_list.append(extracted_data)

        with open(json_path, 'w', encoding='utf-8') as f:
            json.dump(product_list, f, indent=4, ensure_ascii=False)
            
        print(f"Data saved to: {json_filename}")

        # 4. Download ALL Images with ID_Number naming
        # product_id = str(product.get('_id', 'unknown'))
        # product_img_path = os.path.join(output_folder, product_id)
        # ensure_folder_exists(product_img_path)
        
        # print(f"Processing images for ID {product_id}...")
        
        # selected_imgs = product.get('selected_images', {})
        
        # # Use a SET to store URLs to avoid duplicates 
        # # (e.g., front_en might be the same as front_fr sometimes)
        # unique_urls = set()

        # # Collect URLs
        # if selected_imgs:
        #     for category, details in selected_imgs.items():
        #         # We target 'display' (High Res). 
        #         # If you want low res too, add 'small' or 'thumb' to this logic.
        #         img_dict = details.get('display') 
                
        #         if img_dict:
        #             for lang, img_url in img_dict.items():
        #                 unique_urls.add(img_url)
        
        # # Add the main image_url just in case it wasn't in selected_images
        # if product.get('image_url'):
        #     unique_urls.add(product.get('image_url'))

        # # Download and Rename
        # counter = 1
        # for img_url in unique_urls:
        #     # Create filename: ID_1.jpg, ID_2.jpg, etc.
        #     fname = f"{product_id}_{counter}.jpg"
        #     # download_image(img_url, product_img_path, fname)
        #     counter += 1

        # if counter == 1:
        #     print("No images found.")

    except Exception as e:
        print(f"Critical Error: {e}")

def run_scan():
    print(f"Scanning pages {start_page} to {end_page}...")

    for i in range(start_page, end_page + 1):
        # Construct URL (e.g., https://world.openfoodfacts.org/01.json)
        page_str = str(i).zfill(2)
        url = f"https://world.openfoodfacts.org/{page_str}.json?page_count=50&page_size=50"
        
        try:
            response = requests.get(url, headers=headers, timeout=15)
            
            if response.status_code == 200:
                data = response.json()
                products = data.get('products', [])
                
                # Extract IDs and add to our simple array
                for product in products:
                    pid = product.get('_id')
                    if pid:
                        process_single_product(pid)
                        simple_array.append(pid)
                
                # Optional: Print progress so you know it's working
                print(f"Page {i}: Added {len(products)} IDs. Total in array: {len(simple_array)}")
                
            else:
                print(f"Page {i} Skipped (Status: {response.status_code})")

        except Exception as e:
            print(f"Page {i} Error: {e}")

        # Sleep to keep the connection alive
        time.sleep(1.2)

    # --- FINAL RESULT ---
    print("\nScan Complete.")
    print("Here is your array:")
    print(simple_array)

if __name__ == "__main__":
    run_scan()