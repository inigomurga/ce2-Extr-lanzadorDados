import unittest
import requests

BASE_URL = "http://localhost:3000"

class TestRoll(unittest.TestCase):
    def setUp(self):
        requests.post(f"{BASE_URL}/clear")

    def test_roll(self):
        response = requests.post(f"{BASE_URL}/roll", json={"numDice": 3, "numSides": 6})
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("results", data)
        self.assertEqual(len(data["results"]), 3)

    def test_invalid_roll(self):
        response = requests.post(f"{BASE_URL}/roll", json={"numDice": 0, "numSides": 1})
        self.assertEqual(response.status_code, 400)
        data = response.json()
        self.assertIn("error", data)

if __name__ == "__main__":
    unittest.main()
