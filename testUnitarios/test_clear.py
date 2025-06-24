import unittest
import requests

BASE_URL = "http://localhost:3000"

class TestClear(unittest.TestCase):
    def setUp(self):
        requests.post(f"{BASE_URL}/clear")

    def test_clear_history(self):
        requests.post(f"{BASE_URL}/roll", json={"numDice": 1, "numSides": 6})
        resp = requests.post(f"{BASE_URL}/clear")
        self.assertEqual(resp.status_code, 200)
        history = requests.get(f"{BASE_URL}/history").json()
        self.assertEqual(history, [])

if __name__ == "__main__":
    unittest.main()
