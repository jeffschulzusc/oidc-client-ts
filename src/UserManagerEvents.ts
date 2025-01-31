// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

import { Logger, Event } from "./utils";
import { AccessTokenEvents } from "./AccessTokenEvents";
import type { UserManagerSettingsStore } from "./UserManagerSettings";
import type { User } from "./User";

/**
 * @public
 */
export type UserLoadedCallback = (user: User) => Promise<void> | void;
/**
 * @public
 */
export type UserUnloadedCallback = () => Promise<void> | void;
/**
 * @public
 */
export type SilentRenewErrorCallback = (error: Error) => Promise<void> | void;
/**
 * @public
 */
export type UserSignedInCallback = () => Promise<void> | void;
/**
 * @public
 */
export type UserSignedOutCallback = () => Promise<void> | void;
/**
 * @public
 */
export type UserSessionChangedCallback = () => Promise<void> | void;

/**
 * @public
 */
export class UserManagerEvents extends AccessTokenEvents {
    private _userLoaded: Event<[User]>;
    private _userUnloaded: Event<[void]>;
    private _silentRenewError: Event<[Error]>;
    private _userSignedIn: Event<[void]>;
    private _userSignedOut: Event<[void]>;
    private _userSessionChanged: Event<[void]>;

    public constructor(settings: UserManagerSettingsStore) {
        super({ expiringNotificationTimeInSeconds: settings.accessTokenExpiringNotificationTimeInSeconds });
        this._logger = new Logger("UserManagerEvents");

        this._userLoaded = new Event("User loaded");
        this._userUnloaded = new Event("User unloaded");
        this._silentRenewError = new Event("Silent renew error");
        this._userSignedIn = new Event("User signed in");
        this._userSignedOut = new Event("User signed out");
        this._userSessionChanged = new Event("User session changed");
    }

    public load(user: User, raiseEvent=true): void {
        this._logger.debug("load");
        super.load(user);
        if (raiseEvent) {
            this._userLoaded.raise(user);
        }
    }
    public unload(): void {
        this._logger.debug("unload");
        super.unload();
        this._userUnloaded.raise();
    }

    /**
     * Add callback: Raised when a user session has been established (or re-established).
     */
    public addUserLoaded(cb: UserLoadedCallback): void {
        this._userLoaded.addHandler(cb);
    }
    /**
     * Remove callback: Raised when a user session has been established (or re-established).
     */
    public removeUserLoaded(cb: UserLoadedCallback): void {
        this._userLoaded.removeHandler(cb);
    }

    /**
     * Add callback: Raised when a user session has been terminated.
     */
    public addUserUnloaded(cb: UserUnloadedCallback): void {
        this._userUnloaded.addHandler(cb);
    }
    /**
     * Remove callback: Raised when a user session has been terminated.
     */
    public removeUserUnloaded(cb: UserUnloadedCallback): void {
        this._userUnloaded.removeHandler(cb);
    }

    /**
     * Add callback: Raised when the automatic silent renew has failed.
     */
    public addSilentRenewError(cb: SilentRenewErrorCallback): void {
        this._silentRenewError.addHandler(cb);
    }
    /**
     * Remove callback: Raised when the automatic silent renew has failed.
     */
    public removeSilentRenewError(cb: SilentRenewErrorCallback): void {
        this._silentRenewError.removeHandler(cb);
    }
    /**
     * @internal
     */
    public _raiseSilentRenewError(e: Error): void {
        this._logger.debug("_raiseSilentRenewError", e.message);
        this._silentRenewError.raise(e);
    }

    /**
     * Add callback: Raised when the user is signed in.
     */
    public addUserSignedIn(cb: UserSignedInCallback): void {
        this._userSignedIn.addHandler(cb);
    }
    /**
     * Remove callback: Raised when the user is signed in.
     */
    public removeUserSignedIn(cb: UserSignedInCallback): void {
        this._userSignedIn.removeHandler(cb);
    }
    /**
     * @internal
     */
    public _raiseUserSignedIn(): void {
        this._logger.debug("_raiseUserSignedIn");
        this._userSignedIn.raise();
    }

    /**
     * Add callback: Raised when the user's sign-in status at the OP has changed.
     */
    public addUserSignedOut(cb: UserSignedOutCallback): void {
        this._userSignedOut.addHandler(cb);
    }
    /**
     * Remove callback: Raised when the user's sign-in status at the OP has changed.
     */
    public removeUserSignedOut(cb: UserSignedOutCallback): void {
        this._userSignedOut.removeHandler(cb);
    }
    /**
     * @internal
     */
    public _raiseUserSignedOut(): void {
        this._logger.debug("_raiseUserSignedOut");
        this._userSignedOut.raise();
    }

    /**
     * Add callback: Raised when the user session changed (when `monitorSession` is set)
     */
    public addUserSessionChanged(cb: UserSessionChangedCallback): void {
        this._userSessionChanged.addHandler(cb);
    }
    /**
     * Remove callback: Raised when the user session changed (when `monitorSession` is set)
     */
    public removeUserSessionChanged(cb: UserSessionChangedCallback): void {
        this._userSessionChanged.removeHandler(cb);
    }
    /**
     * @internal
     */
    public _raiseUserSessionChanged(): void {
        this._logger.debug("_raiseUserSessionChanged");
        this._userSessionChanged.raise();
    }
}
