from rest_framework.permissions import BasePermission


class IsAdmin(BasePermission):
    """Allows access only to admin users."""

    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role == 'admin'
        )


class IsEditor(BasePermission):
    """Allows access only to editor users."""

    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role in ('editor', 'admin')
        )


class IsReviewer(BasePermission):
    """Allows access only to reviewer users."""

    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role in ('reviewer', 'editor', 'admin')
        )


class IsAuthor(BasePermission):
    """Allows access only to author users."""

    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role in ('author', 'editor', 'admin')
        )


class IsOwner(BasePermission):
    """Allows access only to the owner of the object."""

    def has_object_permission(self, request, view, obj):
        # Check various common owner field names
        if hasattr(obj, 'user'):
            return obj.user == request.user
        if hasattr(obj, 'submitted_by'):
            return obj.submitted_by == request.user
        if hasattr(obj, 'reviewer'):
            return obj.reviewer == request.user
        if hasattr(obj, 'editor'):
            return obj.editor == request.user
        # If the object itself is a User
        return obj == request.user
