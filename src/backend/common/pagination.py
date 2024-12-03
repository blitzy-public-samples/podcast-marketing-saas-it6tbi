"""
Pagination Utilities for Backend Services

This module provides utilities for handling pagination in API responses, ensuring
consistent pagination behavior across backend services.

Requirements Addressed:
- Pagination Support (8.3 API Design/8.3.2 Interface Specifications):
  Provides consistent and reusable pagination utilities for API responses,
  ensuring compliance with API design specifications.

Human Tasks:
1. Review the DEFAULT_PAGE_SIZE value to ensure it aligns with frontend 
   pagination implementation
2. Verify that MAX_PAGE_SIZE is sufficient for the expected data volumes
"""

from typing import List, Dict, Any, Union

from .constants import DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE
from .exceptions import ValidationError


def validate_pagination_params(page_number: int, page_size: int) -> bool:
    """
    Validates pagination parameters to ensure they are within acceptable ranges.

    Args:
        page_number (int): The requested page number (1-based indexing)
        page_size (int): The number of items to return per page

    Returns:
        bool: True if the parameters are valid

    Raises:
        ValidationError: If any pagination parameter is invalid

    Requirements Addressed:
    - Pagination Support (8.3.2 Interface Specifications):
      Ensures pagination parameters are valid and within acceptable ranges
    """
    if not isinstance(page_number, int) or page_number < 1:
        raise ValidationError(
            "Page number must be a positive integer greater than 0"
        )

    if not isinstance(page_size, int) or page_size < 1:
        raise ValidationError(
            "Page size must be a positive integer greater than 0"
        )

    if page_size > MAX_PAGE_SIZE:
        raise ValidationError(
            f"Page size cannot exceed maximum limit of {MAX_PAGE_SIZE}"
        )

    return True


def get_paginated_response(
    items: List[Any],
    page_number: int,
    page_size: int = DEFAULT_PAGE_SIZE
) -> Dict[str, Any]:
    """
    Generates a paginated response for a given list of items.

    Args:
        items (List[Any]): The complete list of items to paginate
        page_number (int): The requested page number (1-based indexing)
        page_size (int, optional): The number of items per page. 
            Defaults to DEFAULT_PAGE_SIZE

    Returns:
        Dict[str, Any]: A dictionary containing:
            - items: List of items for the requested page
            - total_items: Total number of items across all pages
            - total_pages: Total number of pages
            - current_page: Current page number
            - page_size: Number of items per page
            - has_next: Boolean indicating if there are more pages
            - has_previous: Boolean indicating if there are previous pages

    Requirements Addressed:
    - Pagination Support (8.3.2 Interface Specifications):
      Provides a standardized format for paginated responses
    """
    # Validate pagination parameters
    validate_pagination_params(page_number, page_size)

    # Calculate pagination metadata
    total_items = len(items)
    total_pages = (total_items + page_size - 1) // page_size

    # Adjust page number if it exceeds total pages
    if page_number > total_pages and total_pages > 0:
        raise ValidationError(
            f"Page number {page_number} exceeds total pages {total_pages}"
        )

    # Calculate start and end indices
    start_idx = (page_number - 1) * page_size
    end_idx = min(start_idx + page_size, total_items)

    # Get items for current page
    paginated_items = items[start_idx:end_idx]

    return {
        "items": paginated_items,
        "total_items": total_items,
        "total_pages": total_pages,
        "current_page": page_number,
        "page_size": page_size,
        "has_next": page_number < total_pages,
        "has_previous": page_number > 1
    }