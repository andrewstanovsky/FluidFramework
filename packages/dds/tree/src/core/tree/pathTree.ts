/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import type { FieldKey } from "../schema-stored/index.js";

import type { DetachedNodeId } from "./delta.js";
import { type DetachedField, keyAsDetachedField } from "./types.js";

/**
 * Identical to {@link UpPath}, but a duplicate declaration is needed to make
 * the default type parameter compile.
 */
export type UpPathDefault = UpPath;

/**
 * Path from a location in the tree upward.
 * UpPaths can be used with deduplicated upper parts to allow
 * working with paths localized to part of the tree without incurring
 * costs related to the depth of the local subtree.
 *
 * UpPaths can be thought of as terminating at a special root node (that is `undefined`)
 * whose FieldKeys correspond to detached sequences.
 *
 * UpPaths can be mutated over time and should be considered to be invalidated when any edits occurs:
 * Use of an UpPath that was acquired before the most recent edit is undefined behavior.
 */
export interface UpPath<TParent = UpPathDefault> {
	/**
	 * The parent, or undefined in the case where this path is a member of a detached sequence.
	 */
	readonly parent: TParent | undefined;
	/**
	 * The Field under which this path points.
	 * Note that if `parent` returns `undefined`, this key corresponds to a detached sequence.
	 */
	readonly parentField: FieldKey; // TODO: Type information, including when in DetachedField.
	/**
	 * The index within `parentField` this path is pointing to.
	 */
	readonly parentIndex: NodeIndex;
}

/**
 * Identical to {@link INormalizedUpPath}, but a duplicate declaration is needed to make the default type parameter compile.
 */
export type INormalizedUpPathDefault = INormalizedUpPath;

/**
 * Identical to {@link UpPath}, but a with a {@link DetachedNodeId} to specify the ID of detached roots.
 * Note that document roots (i.e., any node in the root field) are not considered detached roots and therefore do not have an associated ID.
 *
 * Use this interface for implementing a class that needs to be used as a {@link NormalizedUpPath}.
 */
export interface INormalizedUpPath<TParent = INormalizedUpPathDefault>
	extends UpPath<TParent> {
	readonly detachedNodeId: DetachedNodeId | undefined;
}

/**
 * Identical to {@link UpPath}, but a with a {@link DetachedNodeId} to specify the ID of detached roots.
 * Note that document roots (i.e., any node in the root field) are not considered detached roots and therefore do not have an associated ID.
 *
 * Prefer this type over {@link INormalizedUpPath} except when implementing a class that needs to be used as a {@link NormalizedUpPath}.
 */
export type NormalizedUpPath =
	| INormalizedUpPath<NormalizedUpPath>
	| NormalizedUpPathInterior<NormalizedUpPath>
	| NormalizedUpPathRoot;

/**
 * The root element of a {@link NormalizedUpPath}.
 */
export interface NormalizedUpPathRoot extends UpPath<undefined> {
	/**
	 * The ID associated with this node if it is a detached root.
	 */
	readonly detachedNodeId: DetachedNodeId | undefined;
}

/**
 * Identical to {@link NormalizedUpPathInterior}, but a duplicate declaration is needed to make the default type parameter compile.
 */
export type NormalizedUpPathInteriorDefault = NormalizedUpPathInterior;

/**
 * An interior (i.e., non-root) element of a {@link NormalizedUpPath}.
 */
export interface NormalizedUpPathInterior<
	TParent = NormalizedUpPathInteriorDefault | NormalizedUpPathRoot,
> extends UpPath<TParent> {
	/**
	 * The parent.
	 */
	readonly parent: TParent;
}

/**
 * Path from a field in the tree upward.
 *
 * See {@link UpPath}.
 */
export type NormalizedFieldUpPath<TParent = NormalizedUpPath> = FieldUpPath<TParent>;

/**
 * Path from a field in the tree upward.
 *
 * See {@link FieldUpPath} and {@link NormalizedUpPath}.
 */
export interface FieldUpPath<TUpPath = UpPath> {
	/**
	 * The parent, or undefined in the case where this path is to a detached sequence.
	 */
	readonly parent: TUpPath | undefined;

	/**
	 * The Field to which this path points.
	 * Note that if `parent` returns `undefined`, this key  corresponds to a detached sequence.
	 */
	readonly field: FieldKey; // TODO: Type information, including when in DetachedField.
}

/**
 * Given an {@link UpPath}, checks if it is a path to a detached root.
 */
export function isDetachedUpPathRoot<T>(
	path: UpPath<T> | NormalizedUpPath,
): path is NormalizedUpPathRoot {
	return (path as NormalizedUpPathRoot).detachedNodeId !== undefined;
}

/**
 * Delimits the extend of a range.
 */
export interface Range {
	/**
	 * The location before the first node.
	 * Must be less than or equal to `end`.
	 */
	readonly start: PlaceIndex;
	/**
	 * The location after the last node.
	 * Must be greater than or equal to `start`.
	 */
	readonly end: PlaceIndex;
}

/**
 * A possibly empty range of nodes in a field.
 * This object only characterizes the location of the range, it does not own/contain the nodes in the range.
 */
export interface RangeUpPath<TUpPath extends UpPath = UpPath>
	extends FieldUpPath<TUpPath>,
		Range {}

/**
 * A place in a field.
 */
export interface PlaceUpPath<TUpPath extends UpPath = UpPath> extends FieldUpPath<TUpPath> {
	/**
	 * The location in the field.
	 */
	readonly index: PlaceIndex;
}

/**
 * Indicates the index of a node in a field.
 * Zero indicates the first node in a field.
 */
export type NodeIndex = number;

/**
 * Indicates a place between nodes in a field or at the extremity of a field.
 * Zero indicates the place at the start of the field (before the first node if any).
 */
export type PlaceIndex = number;

/**
 * Gets the number of nodes above this one.
 * @remarks
 * Zero when the path's parent is undefined, meaning the path represents a node in a detached field.
 * Runs in O(depth) time.
 */
export function getDepth(path: UpPath): number {
	let depth = 0;
	let next = path.parent;
	while (next !== undefined) {
		depth += 1;
		next = next.parent;
	}
	return depth;
}

/**
 * Creates deep copy of the provided path as simple JavaScript object.
 * @remarks This is safe to hold onto and use deep object comparisons on.
 */
export function clonePath(path: UpPath): UpPath;

/**
 * Creates a deep copy of the provided path as simple JavaScript object.
 * @remarks This is safe to hold onto and use deep object comparisons on.
 */
export function clonePath(path: UpPath | undefined): UpPath | undefined;

export function clonePath(path: UpPath | undefined): UpPath | undefined {
	if (path === undefined) {
		return undefined;
	}
	return {
		parent: clonePath(path.parent),
		parentField: path.parentField,
		parentIndex: path.parentIndex,
	};
}

/**
 * Gets the elements of the given `path`, ordered from root-most to child-most.
 * @remarks These elements are unchanged and therefore still point "up".
 */
export function topDownPath(path: UpPath | undefined): UpPath[] {
	const out: UpPath[] = [];
	let curr = path;
	while (curr !== undefined) {
		out.push(curr);
		curr = curr.parent;
	}
	out.reverse();
	return out;
}

/**
 * Returns true if and only if `a` and `b` describe the same path.
 * @remarks
 * Note that for mutable paths (as used in `AnchorSet`), this equality may change over time: this only checks if the two paths are currently the same.
 */
export function compareUpPaths(a: UpPath | undefined, b: UpPath | undefined): boolean {
	if (a === b) {
		// This handles the both `undefined` case, as well as provides an early out if a shared node is encountered.
		return true;
	}
	if (a === undefined || b === undefined) {
		return false;
	}
	if (a.parentField !== b.parentField || a.parentIndex !== b.parentIndex) {
		return false;
	}
	return compareUpPaths(a.parent, b.parent);
}

/**
 * Returns true if and only if `a` and `b` describe the same field path.
 * @remarks
 * Note that for mutable paths (as used in `AnchorSet`), this equality may change over time: this only checks if the two paths are currently the same.
 */
export function compareFieldUpPaths(a: FieldUpPath, b: FieldUpPath): boolean {
	if (a.field !== b.field) {
		return false;
	}
	return compareUpPaths(a.parent, b.parent);
}

/**
 * Checks whether or not a given path is parented under the root field.
 * @param path - the path you want to check.
 * @returns the {@link DetachedField} which contains the path.
 */
export function getDetachedFieldContainingPath(path: UpPath): DetachedField {
	let currentPath = path;
	while (currentPath !== undefined) {
		if (currentPath.parent === undefined) {
			return keyAsDetachedField(currentPath.parentField);
		} else {
			currentPath = currentPath.parent;
		}
	}
	return keyAsDetachedField(path.parentField);
}
