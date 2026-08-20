import requests

BASE_URL = "http://localhost:8000"

# Step 1: start
resp = requests.post(f"{BASE_URL}/interview/start", json={
    "name": "Ramesh",
    "profession": "Electrician",
    "age": 34,
    "lat":10,
    "long":13
})
data = resp.json()
print("START:", data)

thread_id = data["thread_id"]

# Step 2: keep answering until done
canned_answers = [
    "Mostly house wiring and fixing fuse boxes.",
    "I use a multimeter, screwdriver set, and wire stripper.",
    "Once I fixed a short circuit that three other electricians couldn't find.",
]

for answer in canned_answers:
    if data.get("status") == "done":
        break
    resp = requests.post(f"{BASE_URL}/interview/answer", json={
        "thread_id": thread_id,
        "answer": answer
    })
    data = resp.json()
    print("ANSWER ->", data)
    print(answer)

print("\nFINAL RESULT:", data)