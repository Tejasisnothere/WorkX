import uuid

def phone_to_id(phone_number: str) -> str:
    return str(uuid.uuid5(uuid.NAMESPACE_DNS, phone_number))