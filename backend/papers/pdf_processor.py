"""
PDF processor for IRA journal papers.
Adds journal header/banner and footer to submitted PDFs,
similar to the IJARIIT sample format.
"""
import os
import io
import fitz  # PyMuPDF
from django.conf import settings


# IRA brand colors (Google-style)
GOOGLE_BLUE = (66 / 255, 133 / 255, 244 / 255)
GOOGLE_RED = (234 / 255, 67 / 255, 53 / 255)
GOOGLE_YELLOW = (251 / 255, 188 / 255, 4 / 255)
GOOGLE_GREEN = (52 / 255, 168 / 255, 83 / 255)
DARK_TEXT = (32 / 255, 33 / 255, 36 / 255)
MUTED_TEXT = (95 / 255, 99 / 255, 104 / 255)
WHITE = (1, 1, 1)

JOURNAL_NAME = "International Research Archive"
JOURNAL_SHORT = "IRA"
JOURNAL_ISSN = "ISSN: XXXX-XXXX"
JOURNAL_WEBSITE = "www.ira-journal.com"


def _draw_color_strip(page, y, width, height=3):
    """Draw a 4-color Google strip at a given y position."""
    segment = width / 4
    colors = [GOOGLE_BLUE, GOOGLE_RED, GOOGLE_YELLOW, GOOGLE_GREEN]
    for i, color in enumerate(colors):
        rect = fitz.Rect(i * segment, y, (i + 1) * segment, y + height)
        page.draw_rect(rect, color=color, fill=color)


def _add_header(page, paper_title, authors, volume_info="", doi=""):
    """Add IRA journal header to a page."""
    width = page.rect.width
    header_height = 90

    # White header background
    header_rect = fitz.Rect(0, 0, width, header_height)
    page.draw_rect(header_rect, color=WHITE, fill=WHITE)

    # Top color strip
    _draw_color_strip(page, 0, width, height=3)

    # Author line (italic, smaller)
    author_text = ", ".join(authors) if authors else ""
    if author_text:
        author_line = f"{author_text}, {JOURNAL_NAME}"
    else:
        author_line = JOURNAL_NAME
    page.insert_text(
        fitz.Point(30, 20),
        author_line,
        fontsize=8,
        fontname="helv",
        color=MUTED_TEXT,
    )

    # ISSN line
    page.insert_text(
        fitz.Point(30, 32),
        f"({JOURNAL_ISSN})",
        fontsize=8,
        fontname="helv",
        color=MUTED_TEXT,
    )

    # IRA logo text (large, colored letters)
    logo_x = width - 120
    page.insert_text(
        fitz.Point(logo_x, 28),
        "I",
        fontsize=22,
        fontname="helv",
        color=GOOGLE_BLUE,
    )
    page.insert_text(
        fitz.Point(logo_x + 14, 28),
        "R",
        fontsize=22,
        fontname="helv",
        color=GOOGLE_RED,
    )
    page.insert_text(
        fitz.Point(logo_x + 30, 28),
        "A",
        fontsize=22,
        fontname="helv",
        color=GOOGLE_GREEN,
    )

    # Divider line
    page.draw_line(
        fitz.Point(30, 38),
        fitz.Point(width - 30, 38),
        color=MUTED_TEXT,
        width=0.5,
    )

    # Journal name centered
    page.insert_text(
        fitz.Point(30, 52),
        JOURNAL_NAME,
        fontsize=10,
        fontname="helv",
        color=DARK_TEXT,
    )

    # Volume/DOI info
    info_parts = []
    if volume_info:
        info_parts.append(volume_info)
    if doi:
        info_parts.append(f"DOI: {doi}")
    if info_parts:
        page.insert_text(
            fitz.Point(30, 64),
            " | ".join(info_parts),
            fontsize=8,
            fontname="helv",
            color=MUTED_TEXT,
        )

    # Website
    page.insert_text(
        fitz.Point(30, 76),
        f"Available online at: {JOURNAL_WEBSITE}",
        fontsize=8,
        fontname="helv",
        color=GOOGLE_BLUE,
    )

    # Bottom color strip for header
    _draw_color_strip(page, header_height - 3, width, height=3)


def _add_footer(page, page_num, total_pages):
    """Add footer with copyright and page number."""
    width = page.rect.width
    height = page.rect.height
    footer_y = height - 25

    # Color strip
    _draw_color_strip(page, footer_y - 5, width, height=2)

    # Copyright
    page.insert_text(
        fitz.Point(30, footer_y + 10),
        f"\u00a9 2025, {JOURNAL_SHORT} - All rights reserved. | {JOURNAL_WEBSITE}",
        fontsize=7,
        fontname="helv",
        color=MUTED_TEXT,
    )

    # Page number
    page_text = f"Page {page_num} of {total_pages}"
    page.insert_text(
        fitz.Point(width - 100, footer_y + 10),
        page_text,
        fontsize=7,
        fontname="helv",
        color=MUTED_TEXT,
    )


def process_paper_pdf(paper):
    """
    Process a paper's PDF: add IRA header/footer to all pages.
    Saves the processed PDF back to the paper's pdf_file field.

    Args:
        paper: Paper model instance with pdf_file, title, authors, doi fields
    Returns:
        True if processing succeeded, False otherwise
    """
    if not paper.pdf_file:
        return False

    try:
        pdf_path = paper.pdf_file.path
        doc = fitz.open(pdf_path)
    except Exception:
        return False

    # Gather paper metadata
    authors = []
    for author in paper.authors.all().order_by("author_order"):
        authors.append(author.author_name)

    volume_info = ""
    doi = paper.doi or ""

    total_pages = len(doc)

    # Create a new document with headers/footers
    new_doc = fitz.open()

    for page_num in range(total_pages):
        orig_page = doc[page_num]
        orig_width = orig_page.rect.width
        orig_height = orig_page.rect.height

        # Add extra space for header (90pt) and footer (30pt)
        header_space = 90
        footer_space = 30
        new_height = orig_height + header_space + footer_space

        # Create new page with extra space
        new_page = new_doc.new_page(
            width=orig_width, height=new_height
        )

        # White background
        new_page.draw_rect(
            fitz.Rect(0, 0, orig_width, new_height),
            color=WHITE,
            fill=WHITE,
        )

        # Copy original page content shifted down by header_space
        new_page.show_pdf_page(
            fitz.Rect(0, header_space, orig_width, header_space + orig_height),
            doc,
            page_num,
        )

        # Add header (only on first page with full header, others with mini header)
        if page_num == 0:
            _add_header(new_page, paper.title, authors, volume_info, doi)
        else:
            # Mini header for subsequent pages
            _draw_color_strip(new_page, 0, orig_width, height=2)
            new_page.insert_text(
                fitz.Point(30, 15),
                f"{authors[0] + ' et al.,' if authors else ''} {JOURNAL_NAME}",
                fontsize=7,
                fontname="helv",
                color=MUTED_TEXT,
            )
            mini_header_y = 20
            new_page.draw_line(
                fitz.Point(30, mini_header_y),
                fitz.Point(orig_width - 30, mini_header_y),
                color=MUTED_TEXT,
                width=0.3,
            )

        # Add footer
        _add_footer(new_page, page_num + 1, total_pages)

    # Close source doc before saving (Windows file locking)
    doc.close()

    # Save processed PDF, then replace original
    processed_dir = os.path.dirname(pdf_path)
    base_name = os.path.splitext(os.path.basename(pdf_path))[0]
    processed_path = os.path.join(processed_dir, f"{base_name}_processed.pdf")

    new_doc.save(processed_path)
    new_doc.close()

    # Replace original with processed version
    os.replace(processed_path, pdf_path)

    return True
