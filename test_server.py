import unittest
import requests

BASE_URL = "http://localhost:3000"

class TestSimuladorDadosAPI(unittest.TestCase):
    def setUp(self):

        requests.post(f"{BASE_URL}/clear")

    def test_roll_and_history(self):

        response = requests.post(f"{BASE_URL}/roll", json={"numDice": 3, "numSides": 6})
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("results", data)
        self.assertEqual(len(data["results"]), 3)

        history = requests.get(f"{BASE_URL}/history").json()
        self.assertEqual(len(history), 1)
        self.assertEqual(history[0]["numDice"], 3)
        self.assertEqual(history[0]["numSides"], 6)

    def test_invalid_roll(self):

        response = requests.post(f"{BASE_URL}/roll", json={"numDice": 0, "numSides": 1})
        self.assertEqual(response.status_code, 400)
        data = response.json()
        self.assertIn("error", data)

    def test_clear_history(self):

        requests.post(f"{BASE_URL}/roll", json={"numDice": 1, "numSides": 6})
        resp = requests.post(f"{BASE_URL}/clear")
        self.assertEqual(resp.status_code, 200)
        history = requests.get(f"{BASE_URL}/history").json()
        self.assertEqual(history, [])

if __name__ == "__main__":
    unittest.main()
