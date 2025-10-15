from playwright.sync_api import sync_playwright, expect

def run_verification():
    """
    Menjalankan skrip verifikasi Playwright untuk membuka URL, login sebagai admin,
    dan mengambil screenshot halaman leaderboard.
    """
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # URL Web App BARU yang diberikan oleh pengguna
        web_app_url = "https://script.google.com/macros/s/AKfycby_gNj96IRA-fsiD58pWQEIF_5vkwxpQ5w3GlWIH6H2LPulXiftSVVOc9y0K6Ant-dgyw/exec"

        try:
            print(f"Navigasi ke {web_app_url}...")
            page.goto(web_app_url, timeout=60000)

            # 1. Klik tombol "Login Admin"
            print("Mencari tombol Login Admin...")
            admin_login_button = page.get_by_role("button", name="Login Admin")
            expect(admin_login_button).to_be_visible(timeout=30000)
            print("Tombol ditemukan, mengklik...")
            admin_login_button.click()

            # 2. Isi form login (username dan password sudah terisi default)
            print("Mengisi form login (menggunakan nilai default)...")
            username_field = page.locator("#admin-username")
            password_field = page.locator("#admin-password")
            expect(username_field).to_have_value("admin", timeout=10000)
            expect(password_field).to_have_value("password123", timeout=10000)

            # 3. Klik tombol Login
            print("Mencari tombol Login...")
            # Menargetkan tombol login di dalam form admin secara lebih spesifik
            login_button = page.locator("#admin-login-page").get_by_role("button", name="Login")
            expect(login_button).to_be_visible(timeout=10000)
            print("Tombol ditemukan, mengklik...")
            login_button.click()

            # 4. Verifikasi halaman Leaderboard
            print("Memverifikasi halaman leaderboard...")
            leaderboard_title = page.get_by_role("heading", name="Leaderboard")
            expect(leaderboard_title).to_be_visible(timeout=30000)
            print("Judul 'Leaderboard' terlihat.")

            # Tunggu sebentar agar data leaderboard sempat dimuat
            page.wait_for_timeout(5000)

            # 5. Ambil screenshot
            screenshot_path = "jules-scratch/verification/leaderboard_screenshot.png"
            print(f"Mengambil screenshot ke {screenshot_path}...")
            page.screenshot(path=screenshot_path)
            print("Screenshot berhasil diambil.")

        except Exception as e:
            print(f"Terjadi kesalahan: {e}")
            # Ambil screenshot error jika gagal
            page.screenshot(path="jules-scratch/verification/error_screenshot.png")

        finally:
            browser.close()
            print("Browser ditutup.")

if __name__ == "__main__":
    run_verification()
