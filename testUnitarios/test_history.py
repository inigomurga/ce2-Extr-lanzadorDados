import unittest
import requests

BASE_URL = "http://localhost:3000"

class TestHistory(unittest.TestCase):
    def setUp(self):
        requests.post(f"{BASE_URL}/clear")

    def test_history_after_roll(self):
        requests.post(f"{BASE_URL}/roll", json={"numDice": 2, "numSides": 6})
        history = requests.get(f"{BASE_URL}/history").json()
        self.assertEqual(len(history), 1)
        self.assertEqual(history[0]["numDice"], 2)
        self.assertEqual(history[0]["numSides"], 6)

if __name__ == "__main__":
    unittest.main()
