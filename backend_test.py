#!/usr/bin/env python3

import requests
import sys
import json
from datetime import datetime

class EHSASAPITester:
    def __init__(self, base_url="https://elden-alumni.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.admin_token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def log_test(self, name, success, details=""):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {name} - PASSED")
        else:
            print(f"❌ {name} - FAILED: {details}")
        
        self.test_results.append({
            "test": name,
            "status": "PASSED" if success else "FAILED",
            "details": details
        })

    def test_api_health(self):
        """Test basic API connectivity"""
        try:
            response = requests.get(f"{self.base_url}/", timeout=10)
            success = response.status_code == 200
            details = f"Status: {response.status_code}"
            if success:
                details += f", Response: {response.json()}"
            self.log_test("API Health Check", success, details)
            return success
        except Exception as e:
            self.log_test("API Health Check", False, str(e))
            return False

    def test_admin_login(self):
        """Test admin login with provided credentials"""
        try:
            login_data = {
                "email": "deweshkk@gmail.com",
                "password": "Dew@2002k"
            }
            response = requests.post(f"{self.base_url}/auth/admin/login", json=login_data, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                self.admin_token = data.get("token")
                success = bool(self.admin_token)
                details = f"Token received: {bool(self.admin_token)}"
            else:
                success = False
                details = f"Status: {response.status_code}, Response: {response.text}"
            
            self.log_test("Admin Login", success, details)
            return success
        except Exception as e:
            self.log_test("Admin Login", False, str(e))
            return False

    def test_alumni_registration(self):
        """Test alumni registration"""
        try:
            test_alumni = {
                "first_name": "Test",
                "last_name": "Alumni",
                "email": f"test.alumni.{datetime.now().strftime('%H%M%S')}@example.com",
                "mobile": "9876543210",
                "year_of_joining": 2010,
                "year_of_leaving": 2022,
                "class_of_joining": "1",
                "last_class_studied": "12",
                "last_house": "Red House",
                "full_address": "123 Test Street",
                "city": "Mumbai",
                "pincode": "400001",
                "state": "Maharashtra",
                "country": "India",
                "profession": "Software Engineer",
                "organization": "Test Corp"
            }
            
            response = requests.post(f"{self.base_url}/alumni/register", json=test_alumni, timeout=10)
            success = response.status_code == 201
            
            if success:
                data = response.json()
                details = f"Alumni registered with ID: {data.get('id')}"
                # Store the ID for later tests
                self.test_alumni_id = data.get('id')
            else:
                details = f"Status: {response.status_code}, Response: {response.text}"
            
            self.log_test("Alumni Registration", success, details)
            return success
        except Exception as e:
            self.log_test("Alumni Registration", False, str(e))
            return False

    def test_get_spotlight_alumni(self):
        """Test getting spotlight alumni"""
        try:
            response = requests.get(f"{self.base_url}/spotlight", timeout=10)
            success = response.status_code == 200
            
            if success:
                data = response.json()
                details = f"Found {len(data)} spotlight alumni"
            else:
                details = f"Status: {response.status_code}, Response: {response.text}"
            
            self.log_test("Get Spotlight Alumni", success, details)
            return success
        except Exception as e:
            self.log_test("Get Spotlight Alumni", False, str(e))
            return False

    def test_get_events(self):
        """Test getting events"""
        try:
            response = requests.get(f"{self.base_url}/events", timeout=10)
            success = response.status_code == 200
            
            if success:
                data = response.json()
                details = f"Found {len(data)} events"
            else:
                details = f"Status: {response.status_code}, Response: {response.text}"
            
            self.log_test("Get Events", success, details)
            return success
        except Exception as e:
            self.log_test("Get Events", False, str(e))
            return False

    def test_get_alumni_directory(self):
        """Test getting alumni directory (approved only)"""
        try:
            response = requests.get(f"{self.base_url}/alumni?status=approved", timeout=10)
            success = response.status_code == 200
            
            if success:
                data = response.json()
                details = f"Found {len(data)} approved alumni"
            else:
                details = f"Status: {response.status_code}, Response: {response.text}"
            
            self.log_test("Get Alumni Directory", success, details)
            return success
        except Exception as e:
            self.log_test("Get Alumni Directory", False, str(e))
            return False

    def test_admin_stats(self):
        """Test admin stats endpoint"""
        if not self.admin_token:
            self.log_test("Admin Stats", False, "No admin token available")
            return False
        
        try:
            headers = {"Authorization": f"Bearer {self.admin_token}"}
            response = requests.get(f"{self.base_url}/admin/stats", headers=headers, timeout=10)
            success = response.status_code == 200
            
            if success:
                data = response.json()
                details = f"Stats: {data.get('total_alumni', 0)} alumni, {data.get('pending_registrations', 0)} pending"
            else:
                details = f"Status: {response.status_code}, Response: {response.text}"
            
            self.log_test("Admin Stats", success, details)
            return success
        except Exception as e:
            self.log_test("Admin Stats", False, str(e))
            return False

    def test_admin_pending_alumni(self):
        """Test getting pending alumni"""
        if not self.admin_token:
            self.log_test("Admin Pending Alumni", False, "No admin token available")
            return False
        
        try:
            headers = {"Authorization": f"Bearer {self.admin_token}"}
            response = requests.get(f"{self.base_url}/alumni/pending", headers=headers, timeout=10)
            success = response.status_code == 200
            
            if success:
                data = response.json()
                details = f"Found {len(data)} pending alumni"
                # Store pending alumni for approval test
                self.pending_alumni = data
            else:
                details = f"Status: {response.status_code}, Response: {response.text}"
            
            self.log_test("Admin Pending Alumni", success, details)
            return success
        except Exception as e:
            self.log_test("Admin Pending Alumni", False, str(e))
            return False

    def test_admin_approve_alumni(self):
        """Test approving an alumni"""
        if not self.admin_token:
            self.log_test("Admin Approve Alumni", False, "No admin token available")
            return False
        
        if not hasattr(self, 'pending_alumni') or not self.pending_alumni:
            self.log_test("Admin Approve Alumni", False, "No pending alumni to approve")
            return False
        
        try:
            headers = {"Authorization": f"Bearer {self.admin_token}"}
            alumni_id = self.pending_alumni[0]['id']  # Approve first pending alumni
            
            response = requests.put(f"{self.base_url}/alumni/{alumni_id}/approve", headers=headers, timeout=10)
            success = response.status_code == 200
            
            if success:
                data = response.json()
                details = f"Alumni approved with EHSAS ID: {data.get('ehsas_id')}"
            else:
                details = f"Status: {response.status_code}, Response: {response.text}"
            
            self.log_test("Admin Approve Alumni", success, details)
            return success
        except Exception as e:
            self.log_test("Admin Approve Alumni", False, str(e))
            return False

    def test_admin_notifications(self):
        """Test getting admin notifications"""
        if not self.admin_token:
            self.log_test("Admin Notifications", False, "No admin token available")
            return False
        
        try:
            headers = {"Authorization": f"Bearer {self.admin_token}"}
            response = requests.get(f"{self.base_url}/admin/notifications", headers=headers, timeout=10)
            success = response.status_code == 200
            
            if success:
                data = response.json()
                details = f"Found {len(data)} notifications"
            else:
                details = f"Status: {response.status_code}, Response: {response.text}"
            
            self.log_test("Admin Notifications", success, details)
            return success
        except Exception as e:
            self.log_test("Admin Notifications", False, str(e))
            return False

    def test_spotlight_crud(self):
        """Test spotlight alumni CRUD operations"""
        if not self.admin_token:
            self.log_test("Spotlight CRUD", False, "No admin token available")
            return False
        
        headers = {"Authorization": f"Bearer {self.admin_token}"}
        
        # Test CREATE spotlight
        try:
            spotlight_data = {
                "name": "Test Spotlight Alumni",
                "batch": "2020",
                "profession": "Software Engineer",
                "achievement": "Founded a successful startup",
                "category": "founder",
                "image_url": "https://example.com/image.jpg"
            }
            
            response = requests.post(f"{self.base_url}/spotlight", json=spotlight_data, headers=headers, timeout=10)
            if response.status_code == 200:
                created_spotlight = response.json()
                spotlight_id = created_spotlight.get('id')
                self.log_test("Create Spotlight Alumni", True, f"Created spotlight with ID: {spotlight_id}")
                
                # Test UPDATE spotlight
                update_data = spotlight_data.copy()
                update_data["achievement"] = "Updated achievement"
                
                response = requests.put(f"{self.base_url}/spotlight/{spotlight_id}", json=update_data, headers=headers, timeout=10)
                if response.status_code == 200:
                    self.log_test("Update Spotlight Alumni", True, "Spotlight updated successfully")
                else:
                    self.log_test("Update Spotlight Alumni", False, f"Status: {response.status_code}")
                
                # Test DELETE spotlight
                response = requests.delete(f"{self.base_url}/spotlight/{spotlight_id}", headers=headers, timeout=10)
                if response.status_code == 200:
                    self.log_test("Delete Spotlight Alumni", True, "Spotlight deleted successfully")
                    return True
                else:
                    self.log_test("Delete Spotlight Alumni", False, f"Status: {response.status_code}")
                    return False
            else:
                self.log_test("Create Spotlight Alumni", False, f"Status: {response.status_code}, Response: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Spotlight CRUD", False, str(e))
            return False

    def test_events_crud(self):
        """Test events CRUD operations"""
        if not self.admin_token:
            self.log_test("Events CRUD", False, "No admin token available")
            return False
        
        headers = {"Authorization": f"Bearer {self.admin_token}"}
        
        # Test CREATE event
        try:
            event_data = {
                "title": "Test Alumni Reunion",
                "description": "Annual reunion for all batches",
                "event_type": "reunion",
                "date": "2024-12-25",
                "time": "6:00 PM",
                "location": "School Campus",
                "image_url": "https://example.com/event.jpg"
            }
            
            response = requests.post(f"{self.base_url}/events", json=event_data, headers=headers, timeout=10)
            if response.status_code == 200:
                created_event = response.json()
                event_id = created_event.get('id')
                self.log_test("Create Event", True, f"Created event with ID: {event_id}")
                
                # Test UPDATE event
                update_data = event_data.copy()
                update_data["title"] = "Updated Alumni Reunion"
                
                response = requests.put(f"{self.base_url}/events/{event_id}", json=update_data, headers=headers, timeout=10)
                if response.status_code == 200:
                    self.log_test("Update Event", True, "Event updated successfully")
                else:
                    self.log_test("Update Event", False, f"Status: {response.status_code}")
                
                # Test DELETE event
                response = requests.delete(f"{self.base_url}/events/{event_id}", headers=headers, timeout=10)
                if response.status_code == 200:
                    self.log_test("Delete Event", True, "Event deleted successfully")
                    return True
                else:
                    self.log_test("Delete Event", False, f"Status: {response.status_code}")
                    return False
            else:
                self.log_test("Create Event", False, f"Status: {response.status_code}, Response: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Events CRUD", False, str(e))
            return False

    def run_all_tests(self):
        """Run all tests in sequence"""
        print("🚀 Starting EHSAS API Tests...")
        print("=" * 50)
        
        # Basic connectivity
        if not self.test_api_health():
            print("❌ API is not accessible. Stopping tests.")
            return False
        
        # Public endpoints
        self.test_get_spotlight_alumni()
        self.test_get_events()
        self.test_get_alumni_directory()
        
        # Alumni registration
        self.test_alumni_registration()
        
        # Admin authentication
        if self.test_admin_login():
            # Admin-only endpoints
            self.test_admin_stats()
            self.test_admin_pending_alumni()
            self.test_admin_approve_alumni()
            self.test_admin_notifications()
        
        # Print summary
        print("\n" + "=" * 50)
        print(f"📊 Test Summary: {self.tests_passed}/{self.tests_run} tests passed")
        
        if self.tests_passed == self.tests_run:
            print("🎉 All tests passed!")
            return True
        else:
            print(f"⚠️  {self.tests_run - self.tests_passed} tests failed")
            return False

def main():
    tester = EHSASAPITester()
    success = tester.run_all_tests()
    
    # Save detailed results
    with open('/app/test_reports/backend_test_results.json', 'w') as f:
        json.dump({
            'timestamp': datetime.now().isoformat(),
            'total_tests': tester.tests_run,
            'passed_tests': tester.tests_passed,
            'success_rate': f"{(tester.tests_passed/tester.tests_run*100):.1f}%" if tester.tests_run > 0 else "0%",
            'results': tester.test_results
        }, f, indent=2)
    
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())