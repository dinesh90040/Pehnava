
import json
import random
from faker import Faker

fake = Faker("en_IN")

indian_cities = ["Mumbai", "Delhi", "Bengaluru", "Kolkata", "Chennai", "Hyderabad", "Pune", "Ahmedabad", "Surat", "Lucknow", "Jaipur", "Kanpur", "Nagpur", "Indore", "Thane", "Bhopal", "Visakhapatnam", "Pimpri-Chinchwad", "Patna", "Vadodara", "Ghaziabad", "Ludhiana", "Agra", "Nashik", "Faridabad", "Meerut", "Rajkot", "Kalyan-Dombivali", "Vasai-Virar", "Varanasi", "Srinagar", "Aurangabad", "Dhanbad", "Amritsar", "Navi Mumbai", "Allahabad", "Ranchi", "Howrah", "Coimbatore", "Jabalpur", "Gwalior", "Vijayawada", "Jodhpur", "Madurai", "Raipur", "Kota", "Guwahati", "Chandigarh", "Solapur", "Hubli-Dharwad", "Mysore", "Tiruchirappalli", "Bareilly", "Aligarh", "Tiruppur", "Gurgaon", "Moradabad", "Jalandhar", "Bhubaneswar", "Salem", "Warangal", "Guntur", "Bhiwandi", "Saharanpur", "Gorakhpur", "Bikaner", "Amravati", "Noida", "Jamshedpur", "Bhilai", "Cuttack", "Firozabad", "Kochi", "Nellore", "Bhavnagar", "Dehradun", "Durgapur", "Asansol", "Rourkela", "Ajmer", "Ulhasnagar", "Jhansi", "Jammu", "Sangli-Miraj & Kupwad", "Mangalore", "Erode", "Belgaum", "Ambattur", "Tirunelveli", "Malegaon", "Gaya", "Jalgaon", "Udaipur", "Maheshtala", "Davanagere", "Kozhikode", "Kurnool", "Rajahmundry", "Bokaro", "South Dumdum", "Bellary", "Patiala", "Gopalpur", "Agartala", "Bhagalpur", "Muzaffarnagar", "Bhatpara", "Panihati", "Latur", "Dhule", "Rohtak", "Korba", "Bhilwara", "Brahmapur", "Muzaffarpur", "Ahmednagar", "Mathura", "Kollam", "Avadi", "Kadapa", "Kamarhati", "Sambalpur", "Bilaspur", "Shahjahanpur", "Satara", "Bijapur", "Rampur", "Shivamogga", "Chandrapur", "Junagadh", "Thrissur", "Alwar", "Bardhaman", "Kulti", "Kakinada", "Nizamabad", "Parbhani", "Tumkur", "Hisar", "Ozhukarai", "Bihar Sharif", "Panipat", "Darbhanga", "Bally", "Aizawl", "Dewas", "Ichalkaranji", "Tirupati", "Karnal", "Bathinda", "Jalna", "Barasat", "Kirari Suleman Nagar", "Purnia", "Satna", "Mau", "Sonipat", "Farrukhabad", "Sagar", "Rourkela", "Durg", "Imphal", "Ratlam", "Hapur", "Anantapur", "Arrah", "Karimnagar", "Etawah", "Ambernath", "North Dumdum", "Bharatpur", "Begusarai", "New Delhi", "Gandhidham", "Baranagar", "Tiruvottiyur", "Puducherry", "Sikar", "Thoothukudi", "Rewa", "Mirzapur", "Raichur", "Pali", "Ramagundam", "Haridwar", "Vijayanagaram", "Katihar", "Nagercoil", "Sri Ganganagar", "Karawal Nagar", "Mango", "Thanjavur", "Bulandshahr", "Ujjain", "Singrauli", "Munger", "Panchkula", "Burhanpur", "Kharagpur", "Dindigul", "Gandhinagar"]
clothing_categories = ["Men's Kurtas", "Women's Sarees", "Kid's Wear", "Wedding Attire", "Casual Wear", "Ethnic Gowns", "Lehengas", "Sherwanis", "Designer Wear", "Handloom", "Festive Wear", "Bridal Wear"]

markets = []
shop_id_counter = 1
for i in range(1, 151):
    city = random.choice(indian_cities)
    market_name = f'{fake.word().capitalize()} Market'
    
    shops = []
    num_shops = random.randint(10, 15)
    for _ in range(num_shops):
        shops.append({
            "id": shop_id_counter,
            "name": fake.company(),
            "category": random.choice(clothing_categories),
            "description": fake.catch_phrase(),
            "location": f'{market_name}, {city}',
            "contact": fake.phone_number()
        })
        shop_id_counter += 1

    markets.append({
        "id": i,
        "name": market_name,
        "city": city,
        "country": "India",
        "position": [float(fake.latitude()), float(fake.longitude())],
        "description": f"A bustling market in {city} known for its vibrant atmosphere and diverse range of shops.",
        "shops": shops
    })

print(json.dumps(markets, indent=2))
