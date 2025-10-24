#!/usr/bin/env python3
"""
QR Code Generator for Pehenava Payment System
Generates QR codes for UPI payments with payment details
"""

import qrcode
from qrcode.image.styledpil import StyledPilImage
from qrcode.image.styles.moduledrawers import RoundedModuleDrawer
from qrcode.image.styles.colormasks import RadialGradiantColorMask
import os
from datetime import datetime

def generate_payment_qr(amount, merchant_id="pehenava@paytm", merchant_name="Pehenava"):
    """
    Generate QR code for UPI payment
    
    Args:
        amount (float): Payment amount
        merchant_id (str): UPI ID of the merchant
        merchant_name (str): Name of the merchant
    
    Returns:
        str: Path to generated QR code image
    """
    
    # Create UPI payment string
    upi_string = f"upi://pay?pa={merchant_id}&pn={merchant_name}&am={amount}&cu=INR&tn=Pehenava%20Purchase"
    
    # Create QR code instance
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )
    
    # Add data to QR code
    qr.add_data(upi_string)
    qr.make(fit=True)
    
    # Create styled image
    img = qr.make_image(
        image_factory=StyledPilImage,
        module_drawer=RoundedModuleDrawer(),
        color_mask=RadialGradiantColorMask(
            center_color=(255, 193, 7),  # Amber color
            edge_color=(220, 38, 127)    # Rose color
        )
    )
    
    # Create output directory if it doesn't exist
    output_dir = "public/qr_codes"
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    
    # Generate filename with timestamp
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"payment_qr_{amount}_{timestamp}.png"
    filepath = os.path.join(output_dir, filename)
    
    # Save the image
    img.save(filepath)
    
    print(f"QR Code generated successfully: {filepath}")
    print(f"UPI String: {upi_string}")
    
    return filepath

def generate_static_qr():
    """
    Generate a static QR code for general payments
    """
    # Create a general UPI payment QR
    upi_string = "upi://pay?pa=pehenava@paytm&pn=Pehenava&cu=INR&tn=Pehenava%20Purchase"
    
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=15,
        border=4,
    )
    
    qr.add_data(upi_string)
    qr.make(fit=True)
    
    # Create styled image with brand colors
    img = qr.make_image(
        image_factory=StyledPilImage,
        module_drawer=RoundedModuleDrawer(),
        color_mask=RadialGradiantColorMask(
            center_color=(255, 193, 7),  # Amber
            edge_color=(220, 38, 127)    # Rose
        )
    )
    
    # Save to public directory
    output_dir = "public/qr_codes"
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    
    filepath = os.path.join(output_dir, "pehenava_payment_qr.png")
    img.save(filepath)
    
    print(f"Static QR Code generated: {filepath}")
    return filepath

def generate_qr_with_amount(amount):
    """
    Generate QR code for specific amount (for demo purposes)
    """
    return generate_payment_qr(amount)

if __name__ == "__main__":
    print("Pehenava QR Code Generator")
    print("=" * 40)
    
    # Generate static QR code
    print("\n1. Generating static QR code...")
    static_qr = generate_static_qr()
    
    # Generate QR codes for common amounts
    print("\n2. Generating QR codes for common amounts...")
    amounts = [1000, 2500, 5000, 10000, 25000, 50000]
    
    for amount in amounts:
        print(f"   Generating QR for ₹{amount:,}...")
        generate_qr_with_amount(amount)
    
    print("\n✅ All QR codes generated successfully!")
    print("\nQR codes are saved in: public/qr_codes/")
    print("You can use these in your React application.")
